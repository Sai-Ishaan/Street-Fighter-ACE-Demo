var Ai = function(){

	var self = this, timer, enemy = self.enemy, queue = Interfaces.Queue(), level = 5;

	enemy.bloodBar.event.listen( 'drain', function(){
		timer.stop();
	})

	var random = function( num ){
		return Math.random() * num | 0;
	}


	var responsefn = function( distance ){

		var state = enemy.state, enemy_statusManage = enemy.statusManage, attack_type = enemy_statusManage.get().attack_type, response;
		var invincible = enemy_statusManage.get().invincible
		
		if ( attack_type === 'attack' && self.statusManage.get().attack_type === 'defense' ){
			return response = {
				correct: [ 'force_wait', 'jump_back', 'force_forward' ],
				wrong: [ 'force_wait', 'force_wait' ]
			}
		}

		if ( attack_type === 'fall_down' || invincible ){
			return response = {
				correct: [ 'jump_back', 'force_back', 'heavy_wave_boxing' ],
				wrong: [ 'force_wait', 'force_wait' ]
			}
		}
		
		if ( state === 'jump_whirl_kick' || state === 'light_jump_whirl_kick' ){
			if ( distance === 'near' || distance === 'middle' ){
				return response	= {
					correct: [ 'jump_heavy_impact_boxing' ],
					wrong: [ 'force_wait', 'force_wait' ]	
				}	
			}
			return response	= {
				correct: [  'crouch' ],
				wrong: [ 'force_wait', 'force_wait' ]	
			}
		}

		if ( distance === 'near' ){
			
			if ( enemy.waveBoxing.firing ){
				return response = {
					correct: [ 'force_forward', 'jump_whirl_kick', 'jump_whirl_kick' ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}
			
			if ( enemy.statusManage.isJump() ){  //�������Ծ
				return response = {
					correct: [ [ 'jump', 'heavy_kick' ], 'jump_heavy_impact_boxing', 'jump_light_impact_boxing' ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]
				}
			}

			
			if ( attack_type === 'attack' ){  //����ǹ���
				return response = {
					correct: [ 'force_forward', 'jump_back' ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}

			else {
				return response = {
					correct: [ 'crouch_heavy_kick', 'heavy_boxing', 'light_boxing', 'crouch_light_kick' ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]
				}
			}

		}

		else if ( distance === 'middle' ){
			
			if ( enemy.waveBoxing.firing ){
				return response = {
					correct: [ [ 'jump_forward', 'heavy_kick' ], 'force_back' ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}
			
			if ( enemy.statusManage.isJump() ){  
				return response = {
					correct: [ [ 'jump', 'heavy_kick' ] ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]
				}
			}

			if ( attack_type === 'attack' ){ 
				return response = {
					correct: [ enemy_statusManage.isCrouch() ? 'stand_crouch_defense' : 'stand_crouch_defense', 'crouch_heavy_kick', 'jump_whirl_kick', 'jump_heavy_impact_boxing', 'crouch_heavy_boxing' ],
					wrong: [ 'haha', '' ]
				}
			}


			else {
				return response = {
					correct: [ 'force_back', 'light_wave_boxing', [ 'jump_back', 'heavy_kick' ] ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]	
				}	
			}
		}

		else if ( distance === 'far' ){
			
			if ( enemy.waveBoxing.firing ){
				return response = {
					correct: [ 'jump_whirl_kick', 'jump_whirl_kick', [ 'jump_forward', 'heavy_kick' ] ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}
			
			if ( enemy.statusManage.isJump() ){  
				return response = {
					correct: [ 'jump_heavy_impact_boxing', [ 'jump_forward', 'heavy_kick' ] ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]
				}
			}
			
			if ( attack_type === 'attack' ){ 
				response = {
					correct: [ enemy_statusManage.isCrouch() ? 'stand_crouch_defense' : 'stand_crouch_defense', 'jump_whirl_kick', 'jump_back', [ 'jump_forward', 'heavy_kick' ] ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}


			else {
				return response = {
					correct: [ 'force_forward', 'jump_back', 'heavy_wave_boxing', [ 'force_back', 'force_back' ] ],
					wrong: [ 'force_wait', 'crouch_heavy_kick' ]
				}
			}

		}

		else{
			if ( enemy.waveBoxing.firing ){
				return response = {
					correct: [ 'light_wave_boxing' ],
					wrong: [ 'force_wait', 'force_wait' ]
				}
			}
			return response = {
				correct: [ 'force_forward', 'force_forward', 'force_forward', 'force_forward', 'light_wave_boxing', 'heavy_wave_boxing', [ 'jump_back', 'heavy_wave_boxing' ] ],
				wrong: [ 'force_wait', 'crouch_heavy_kick' ]
			}


		}

		
		return response;
		


	}
	
	setTimeout(function() {
		queue.add(re);
	}, 300); 
	

	
	var framefn = function(){


		if ( self.queue.isEmpty() && !queue.isEmpty() ){
			return self.play( queue.dequeue() || 'force_wait' );
		}

		var distance = self.statusManage.get().enemy_distance_type;

		var re = responsefn(distance);


		if ( !re ){
			re = {
				correct: [ 'force_wait' ],
				wrong: [ 'force_wait' ]	
			}
		}

		
		if ( random( 10 ) < level -2 ){
			try{
				re = re.correct; 	
			}catch(e){
				console.log( enemy.state )	
			}
		}else{
			re = re.wrong;
		}
		

		re = re[ random( re.length ) ];
		queue.add( re );
		
		var dequeue = queue.dequeue();
		return self.play( dequeue || 'wait' );
		try{

		}catch(e){
			console.log( 111 )
		}
		
		
	}
	
	timer = Timer.add( framefn );
	
	//timer.destory();
	

	var start = function(){
		timer.start();
	}

	var stop = function(){
		timer.stop();	
	}
	
	return {
		start: start,
		stop: stop
		
	}	
}