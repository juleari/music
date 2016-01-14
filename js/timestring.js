(function (music) {

    /**
    * Константы времени в секундах
    */
    var MINUTE = 60,
        HOUR   = 60 * MINUTE,
        DAY    = 24 * HOUR;

    /**
    * Повторяет исходную строку n раз.
    * @param {Number} n Число повторений строки
    * @return {String} Размноженная строка.
    */
    String.prototype.times = function(n) {
        return new Array(n + 1).join(this);
    };
        
    /**
    * Возвращает частное от деления dividend на divisor,
    * дополненное справа необходимым количеством нулей 
    * @param {Number} dividend Делимое
    * @param {Number} divisor Делитель
    * @param {Number} len Требуемая длина строки
    * @return {String} Частное, дополненное справа appendix'ом.
    */
    var qString = function(dividend, divisor, len) {

        divisor      = divisor || 1;

        var quotient = parseInt(dividend / divisor) + '';
        len          = Math.max(len, quotient.length);

        return '0'.times(len - quotient.length) + quotient;
    };
        
    /**
    * Преобразует время в секундах, в строку 
    * фомата: ДНИ:ЧАСЫ:МИНУТЫ:СЕКУНДЫ
    * @param {Number} time Время в секундах
    * @param {Number} maxTime Максимальное время в секундах
    * @param {Bool} inv Оставшееся время / Текущее время
    * @return {String} Строка времени.
    */
    var timeToString = function(time, maxTime, inv) {

        maxTime = maxTime || 0;

        var timeString = '', len = 0;

        if (inv) {

            timeString = '- ';
            time       = maxTime - time;
        }

        if (time >= DAY || maxTime >= DAY) {

            /* количество цифр, в числе дней максимального времени*/
            len        = (parseInt(maxTime / DAY) + '').length;

            timeString += qString(time, DAY, len) + ':';
            len        = 2;
        };

        if (time >= HOUR || len || maxTime >= HOUR) {

            /** 
            * количество цифр в часах: 2, если были дни
            * иначе
            * количество цифр, в числе часов максимального времени
            */
            len        = len || (parseInt(maxTime / HOUR) + '').length;

            timeString += qString(time%DAY, HOUR, len) + ':';
            len        = 2;
        }

        if (time >= MINUTE || len || maxTime >= MINUTE) {

            /** 
            * количество цифр в часах: 2, если были часы
            * иначе
            * количество цифр, в числе минут максимального времени
            */
            len        = len || (parseInt(maxTime / MINUTE) + '').length;

            timeString += qString(time%HOUR, MINUTE, len) + ':';
            len        = 2;
        }
        
        /** 
        * количество цифр в часах: 2, если были минуты
        * иначе
        * количество цифр, в числе секунд максимального времени
        */
        len        = len || (parseInt(maxTime) + '').length;
        timeString += qString(time%MINUTE, null, len);
        
        return timeString;
    }

    music.timeToString = timeToString;
    
} (window.music));