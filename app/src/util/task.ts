export class Task {
  private _taskTimer: NodeJS.Timeout | undefined
  private _taskInterval: number
  private _task: () => Promise<boolean>
  private _callback?: () => any

  constructor(task: () => Promise<boolean>, interval: number) {
    this._task = task;
    this._taskInterval = interval;

    return this;
  }

  _run(): void {
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

  _onStop() {
    this._callback && this._callback();
  }

  start(callback?: () => any): void {
    this._callback = callback;
    if (this._taskTimer) {
      return;
    }

    this._run();
  }


  stop(): void {
    this._onStop();
    if (!this._taskTimer) {
      return;
    }
    window.clearTimeout(this._taskTimer);
    this._taskTimer = undefined;
  }
}