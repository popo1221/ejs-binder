// loop.js
function Loop(callback, interval, name) {
	this.callback_ = callback;
	this.interval_ = interval;
	this.name_ = name;
}

Loop.prototype = {
	run: function() {
		this.queueNextTick_();
	},

	onTimeout_: function() {
		try {
            console.log('Runging task [' + this.name_ + '] at ' + (new Date));
            this.callback_(this).then(this.queueNextTick_.bind(this));
        }
        catch (error) {
            // TODO: handle error
            this.errorInterval(error);    
        }
	},

    errorInterval: function(error) {
        console.log(error);

        this.queueNextTick_();
    },

	queueNextTick_: function () {
		this.timeoutId_ = setTimeout(this.onTimeout_.bind(this), this.interval_);
	}
};

module.exports = Loop;