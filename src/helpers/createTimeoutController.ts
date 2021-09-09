import { fakeTimersAreEnabled, advanceTimers } from './fakeTimers'

function createTimeoutController(
  timeout: number | false,
  { allowFakeTimers }: { allowFakeTimers: boolean }
) {
  let timeoutId: NodeJS.Timeout
  const timeoutCallbacks: Array<() => void> = []

  const timeoutController = {
    onTimeout(callback: () => void) {
      timeoutCallbacks.push(callback)
    },
    wrap(promise: Promise<void>) {
      return new Promise<void>((resolve, reject) => {
        timeoutController.timedOut = false
        timeoutController.onTimeout(resolve)

        if (timeout) {
          timeoutId = setTimeout(() => {
            timeoutController.timedOut = true
            timeoutCallbacks.forEach((callback) => callback())
            resolve()
          }, timeout)
        }

        let finished = false

        promise
          .then(resolve)
          .catch(reject)
          .finally(() => {
            finished = true
            timeoutController.cancel()
          })

        if (allowFakeTimers && fakeTimersAreEnabled()) {
          advanceTimers(timeout, () => finished)
        }
      })
    },
    cancel() {
      clearTimeout(timeoutId)
    },
    timedOut: false
  }

  return timeoutController
}

export { createTimeoutController }
