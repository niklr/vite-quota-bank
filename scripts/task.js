class Task {
    _taskTimer
    _taskInterval
    _task
    _callback

    constructor(task, interval) {
        this._task = task;
        this._taskInterval = interval;

        return this;
    }

    _run() {
        this._taskTimer = setTimeout(async () => {
            if (!this._task) {
                this._onStop();
                return;
            }
            if (!(await this._task())) {
                this._onStop();
                return;
            }
            this._run();
        }, this._taskInterval);
    }

    start(callback) {
        this._callback = callback;
        if (this._taskTimer) {
            return;
        }

        this._run();
    }


    stop() {
        this._onStop();
        if (!this._taskTimer) {
            return;
        }
        window.clearTimeout(this._taskTimer);
        this._taskTimer = undefined;
    }

    _onStop() {
        this._callback && this._callback();
    }
}

module.exports = Task;
