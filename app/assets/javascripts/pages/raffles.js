function Raffle(params) {

	var api = params.api;
	var modal = params.modal;
	var $container = params.$container;

	var $selectedPositionsTable = $container.find('.voting-widget__selected-positions-table');
	var $selectedPositionsNote = $container.find('.voting-widget__selected-positions-note');
	var $availablePointsNote = $container.find('.voting-widget__available-points-note');
	var $avaliablePointsCounter = $container.find('.voting-widget__available-points-counter');
	var $submit = $container.find('.voting-widget__vote-btn');
	var $random = $container.find('.voting-widget__random-btn');
	var votes = [];
	var stage = $container.data('stage');

	function getAvailablePoints() {
		var availablePoints = Number($container.data('points'));
		if (votes.length) availablePoints = availablePoints - votes.map(function(vote){return vote.points}).reduce(function(a, b){return a + b});
		return availablePoints;
	}

	function renderSelectedPositions() {
		if (votes.length) {
			$selectedPositionsNote.hide();
			$selectedPositionsTable.show();
			$selectedPositionsTable.find('tr:not(:first-child)').remove();
			for (var i = 0; i < votes.length; i++) {
				$selectedPositionsTable.find('tr:last-child').after('<tr><td>' + votes[i].position + '</td><td>' + votes[i].points + '</td><td><button type="button" class="voting-widget__delete-btn btn btn-sm btn-danger btn-flat" data-vote-number=' + i + '><i class="fa fa-trash"></i></button></td></tr>');
			}
			$avaliablePointsCounter.html(getAvailablePoints());
			$availablePointsNote.show();
		} else {
			$selectedPositionsTable.hide();
			$selectedPositionsNote.show();
			$avaliablePointsCounter.html(getAvailablePoints());
			$availablePointsNote.hide();
		}
		$submit.attr('disabled', getAvailablePoints() > 0)
	}

	$container.on('click', '.voting-widget__positions-table_voting .voting-widget__position', function() {
		if ($(this).is('.voting-widget__position_owned')) return;
		if ($(this).is('.voting-widget__position_voted')) return;
		if (getAvailablePoints() <= 0) return;
		var position = Number($(this).data('position'));
		modal.open(getAvailablePoints(), function(points) {
			votes.push({position: position, points: points});
			renderSelectedPositions();
		});
	});

	$container.on('click', '.voting-widget__delete-btn', function() {
		votes.splice($(this).data('vote-number'), 1);
		renderSelectedPositions();
	});

	$random.on('click', function() {
		$random.attr('disabled', true);
		var positionsOwned = $container.data('positions-owned');
		var positionsTotal = $container.data('positions-total');
		var availablePoints = Number($container.data('points'));
		var randomVotes = {};
		var targetPositions = [];
		for (var i = 0; i < positionsTotal; i++) {
			if (positionsOwned.indexOf(i) < 0) targetPositions.push(i);
		}
		while (availablePoints > 0) {
			var points = parseInt(Math.random() * availablePoints);
			if (points > 0) {
				if (points > availablePoints) points = availablePoints;
				availablePoints = availablePoints - points;
				var position = targetPositions[parseInt(Math.random() * (targetPositions.length - 1) + 1)];
				randomVotes[position] = randomVotes[position] ? randomVotes[position] + points : points;
			}
		}
		votes = [];
		for (var key in randomVotes) {
			if (randomVotes.hasOwnProperty(key)) votes.push({position: Number(key), points: randomVotes[key]});
		}
		renderSelectedPositions();
		$random.attr('disabled', false);
	});

	$submit.on('click', function() {
		if (!votes.length || getAvailablePoints() > 0) return;
		$.ajax({
			method: 'POST',
			url: api,
			data: JSON.stringify({stage: stage, votes: votes.map(function(vote){return {position: vote.position, points: vote.points}})}),
			contentType: 'text/json'
		}).done(function() {
			document.location.reload()
		});
		$submit.attr('disabled', true);
	});

}

function RaffleModal(params) {
	var $container = params.$container;

	var $input = $container.find('[data-bind="input"]');
	var $minus = $container.find('[data-bind="minus"]');
	var $plus = $container.find('[data-bind="plus"]');
	var $submit = $container.find('[data-bind="submit"]');
	var $availablePoints = $container.find('[data-bind="available-points"]');
	var onSubmit = null;
	var availablePoints = 0;

	function setAvailablePoints(points) {
		availablePoints = Number(points);
		$availablePoints.html(availablePoints);
	}

	function open(availablePoints, onSubmitCb) {
		setAvailablePoints(availablePoints);
		$input.val(1);
		onSubmit = onSubmitCb;
		$container.modal('show');
	}

	$minus.on('click', function() {
		var points = Number($input.val());
		var newPoints = (points - 1);
		if (newPoints < 1) return;
		$input.val(newPoints);
	});

	$plus.on('click', function() {
		var points = Number($input.val());
		var newPoints = (points + 1);
		if (newPoints > availablePoints) return;
		$input.val(newPoints);
	});

	$submit.on('click', function() {
		var points = Number($input.val());
		if (points < 1 || points > availablePoints) return;
		if (onSubmit) onSubmit(points);
		onSubmit = null;
	});

	return {open: open}
}
