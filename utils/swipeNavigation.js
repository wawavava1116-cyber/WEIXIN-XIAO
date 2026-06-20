const MAIN_TAB_ROUTES = [
  'pages/index/index',
  'pages/schedule/schedule',
  'pages/prediction/prediction',
  'pages/profile/profile'
]

const MIN_SWIPE_DISTANCE = 90
const MAX_VERTICAL_DISTANCE = 55
const MAX_SWIPE_DURATION = 900

function getTouchPoint(event) {
  const touches = event && event.changedTouches && event.changedTouches.length
    ? event.changedTouches
    : (event && event.touches) || []
  return touches[0] || null
}

function getGestureState(page) {
  if (!page.__swipeNavigationState) {
    page.__swipeNavigationState = {}
  }
  return page.__swipeNavigationState
}

function startSwipe(event) {
  const point = getTouchPoint(event)
  if (!point) return
  const state = getGestureState(this)
  state.startX = point.clientX
  state.startY = point.clientY
  state.startTime = Date.now()
}

function getSwipeDelta(page, event) {
  const state = getGestureState(page)
  const point = getTouchPoint(event)
  if (!point || typeof state.startX !== 'number') return null
  const deltaX = point.clientX - state.startX
  const deltaY = point.clientY - state.startY
  const duration = Date.now() - (state.startTime || Date.now())
  state.startX = null
  state.startY = null
  state.startTime = null
  if (Math.abs(deltaX) < MIN_SWIPE_DISTANCE) return null
  if (Math.abs(deltaY) > MAX_VERTICAL_DISTANCE) return null
  if (duration > MAX_SWIPE_DURATION) return null
  return deltaX
}

function switchMainTab(currentRoute, deltaX) {
  const currentIndex = MAIN_TAB_ROUTES.indexOf(currentRoute)
  if (currentIndex === -1) return
  const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1
  const nextRoute = MAIN_TAB_ROUTES[nextIndex]
  if (!nextRoute) return
  wx.switchTab({ url: `/${nextRoute}` })
}

function goBackOrHome() {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    wx.navigateBack({ delta: 1 })
    return
  }
  wx.switchTab({ url: '/pages/index/index' })
}

function createMainSwipeHandlers(currentRoute) {
  return {
    onPageTouchStart: startSwipe,
    onPageTouchEnd(event) {
      const deltaX = getSwipeDelta(this, event)
      if (!deltaX) return
      switchMainTab(currentRoute, deltaX)
    }
  }
}

function createBackSwipeHandlers() {
  return {
    onPageTouchStart: startSwipe,
    onPageTouchEnd(event) {
      const deltaX = getSwipeDelta(this, event)
      if (deltaX > 0) {
        goBackOrHome()
      }
    }
  }
}

module.exports = {
  createMainSwipeHandlers,
  createBackSwipeHandlers
}
