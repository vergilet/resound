var supportedFlag = $.keyframe.isSupported();
		
		function Player(audio, i) {
			this.instanse = $(audio);
			this.id = i;
			this.active = false;
			this.player_instanse = $(audio).get(0);
			
			this._parentBlock = this.instanse.parents('.block')
			this._playButton = this._parentBlock.find('.play');
			this._pauseButton = this._parentBlock.find('.pause');
			this._equalizer = this._parentBlock.find('.spinner');
			this._volumeInput = this._parentBlock.find('.slider');
			
			this._bindPlay();
			this._bindPause();
			this._bindVolume();
		}
		
		Player.instantize = function() {
			i = 0
			$('audio').each(function() {
				i += 1;
				new Player($(this), i);
			});
		}
		
		
		Player.prototype.cycle = function(){
			return {
				name: 'sk-stretchdelay' + this.id,
				duration: '1.2s',
				iterationCount: 'infinite',
				timingFunction: 'ease-in-out'
			}
		}
		
		Player.prototype.defineKeyframe = function(currentScale) {
			var min = currentScale - 0.25
			var result = (min < 0) ? 0 : min;
			var self = this;
			$.keyframe.define([{
				name: 'sk-stretchdelay' + self.id,
				'0%':   { transform: 'scaleY(' + result + ')' }, 
				'50%':  { transform: 'scaleY(' + result + ')' }, 
				'100%': { transform: 'scaleY(' + result + ')' },
				'25%':  { transform: 'scaleY(' + currentScale + ')' },
				'75%':  { transform: 'scaleY(' + currentScale + ')' }
			}]);
		}
		
		Player.prototype.setVolume = function(number) {
			this.player_instanse.volume = number;
		}
		Player.prototype.getVolume = function() {
			this.player_instanse.volume;
		}
		Player.prototype._bindPlay = function() {
			var self = this;
			this._playButton.on('click', function(e) {
				self.active = true;
				self._play();
			})
		}
		Player.prototype._bindPause = function() {
			var self = this;
			this._pauseButton.on('click', function() {
				self.active = false;
				self._pause();
			})
		}
		Player.prototype._bindVolume = function() {
			var self = this;
			this.setVolume(this._volumeInput.val())
			this.defineKeyframe(this._volumeInput.val())
			this._volumeInput.on('input', function(){
				self.setVolume($(this).val());
			});
			this._volumeInput.on('change', function(){
				self._removeEqualizer();
				self.defineKeyframe($(this).val());
				if (self.active)
					self._addEqualizer();
				
			})
		}	
		Player.prototype._play = function() {
			console.log('-play-');
			console.log(this.active);
			$playButton = this._playButton;
			$pauseButton = this._pauseButton;
			
			$playButton.addClass('hidden');
			$pauseButton.removeClass('hidden');

			this.player_instanse.play();
			this._addEqualizer();
		}
		Player.prototype._pause = function() {
			console.log('-pause-');
			console.log(this.active);
			$playButton = this._playButton;
			$pauseButton = this._pauseButton;

			$playButton.removeClass('hidden');
			$pauseButton.addClass('hidden');
		
			this.player_instanse.pause();
			this._removeEqualizer();
		}		
		Player.prototype._addEqualizer = function() {
			console.log('-add eq-');
			html = [1,2,3,3,1,3,1,4,4,3,1,2,3,1,4,3,1,3,4,3].map(function(val){
				return '<div class="rect' + val + '"></div>'
			});
			this._equalizer.html(html);
			this._playFrameFor('.rect1', '-0.2s');
			this._playFrameFor('.rect2', '-0.0s');
			this._playFrameFor('.rect3', '-0.1s');
			this._playFrameFor('.rect4', '-0.3s');
		}
		Player.prototype._playFrameFor = function(_class, delay) {
			var self = this;
			this._equalizer.find(_class).playKeyframe([
				$.extend( {delay: delay}, self.cycle() )
			])
		}
		Player.prototype._removeEqualizer = function() {
			this._equalizer.find('div').resetKeyframe();
			console.log('-remove eq-');
			this._equalizer.html('');
		}