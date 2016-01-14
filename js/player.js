(function (music) {

    var audio = {};
    
    function Player(name) {

        var self = this;

        /* отслеживаемые переменные */
        self.max_time    = ko.observable(0);    // длина композиции, устанавливается при изменении длины композиции у аудио
        self.duration    = ko.observable(0);    // текстовый вариант длины композиции
        self.current_time= ko.observable(0);    // текущее время, изменяется вручную и во время проигрывания аудиозаписи
        self.volume      = ko.observable(1);    // громкость, изменяется вручную 
        self.name        = ko.observable(name); // название композиции
        
        /* флаги, устанавливаемые вручную */
        self.inv         = false;  // флаг отображения текущего времени:
                                   // false - сколько времени прошло от начала
                                   // true  - сколько времени осталось до конца
        self.play_change = false;  // флаг изменения от проигрывания - когда false - можно менять текущее время у audio

        /* классы кнопок */
        self.play_pause_button  = ko.observable('glyphicon glyphicon-play');      // кнопка проигрывания/паузы аудиозаписи
        self.mute_unmute_button = ko.observable('glyphicon glyphicon-volume-on'); // кнопка включения/выключения звука

        /** 
        * текстовое отображение текужего времени,
        * изменяется при изменении current_time
        */
        self.time = ko.pureComputed(function() {
            
            self.play_change = false;

            return music.timeToString(self.current_time(), self.max_time(), self.inv);

        }, self);

        /* текущая громкость в процентах */
        self.volume_pc = ko.pureComputed(function() {

            /* изменение громкости у аудио */
            if (audio.readyState) audio.volume = self.volume();
            
            return parseInt(self.volume() * 100) + '%';

        }, self);

        /* изменение флага отображения текущего времени */
        self.inv_time = function(player, e) {

            self.inv = !self.inv;

            /* изменение текстового значения текущего времени */
            e.target.innerText = music.timeToString(self.current_time(), self.max_time(), self.inv);
        };

        /* включение / выключение громкости */
        self.mute_unmute_action = function(){

            if (audio.muted) {

                self.mute_unmute_button('glyphicon glyphicon-volume-on');
                audio.muted = false;

            } else {

                self.mute_unmute_button('glyphicon glyphicon-volume-off');
                audio.muted = true;
            }
        };

        /* проигрывание / пауза аудиозаписи */
        self.play_pause_action = function(){

            if (audio.paused) {

                self.play_pause_button('glyphicon glyphicon-pause');
                audio.play();

            } else {

                self.play_pause_button('glyphicon glyphicon-play');
                audio.pause();
            }
        };

        /* изменение иконки play/pause по окончанию проигрывании аудиозаписи */
        self.play_end = function(){

            self.play_pause_button('glyphicon glyphicon-play');
        };

        /* изменение длительности */
        self.set_duration = function(player, e) {

            var dur = e.target.duration;

            audio = e.target; // элемент <audio></audio>

            self.duration(music.timeToString(dur));
            self.max_time(dur);
        }; 

        /* изменение текущего времени */
        self.set_time = function(player, e){
            
            /* изменение времени у аудио, если у input'a оно было изменено вручную */
            if (audio.readyState && !self.play_change) audio.currentTime = self.current_time();
            
            self.current_time(e.target.currentTime);
            self.play_change = true;
        };
    }

    music.Player = Player;

    var player = new music.Player('Ugress');

    ko.applyBindings(player);
    
} (window.music));