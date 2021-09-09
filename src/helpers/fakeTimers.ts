export function fakeTimersAreEnabled() {
  /* istanbul ignore else */
  if (typeof jest !== 'undefined' && jest !== null) {
    return (
      // legacy timers
      jest.isMockFunction(setTimeout) ||
      // modern timers
      Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
    )
  }
  // istanbul ignore next
  return false
}

export function advanceTimers(timeout: number | false, checkContinue: () => boolean) {
  const advanceTime = async (currentMs: number) => {
    if (!timeout || currentMs < timeout) {
      jest.advanceTimersByTime(1)

      await Promise.resolve()

      if (checkContinue()) {
        return
      }

      await advanceTime(currentMs + 1)
    }
  }

  advanceTime(0)
}
