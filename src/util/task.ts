export class Task {
  private _taskTimer: NodeJS.Timeout | undefined
  private _taskInterval: number
  private _task: () => Promise<void>

  constructor(task: () => Promise<void>, interval: number) {
    this._task = task;
    this._taskInterval = interval;

    return this;
  }

  _run(): void {
    this._taskTimer = setTimeout(async () => {
      if (!this._task) {
        return;
      }
      await this._task()
      this._run();
    }, this._taskInterval);
  }

  start(): void {
    if (this._taskTimer) {
      return;
    }

    this._run();
  }


  stop(): void {
    if (!this._taskTimer) {
      return;
    }
    window.clearTimeout(this._taskTimer);
    this._taskTimer = undefined;
  }
}