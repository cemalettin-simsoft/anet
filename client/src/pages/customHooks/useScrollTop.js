import { useEffect, useRef } from "react"
import { useLocation } from "react-router-dom"
import { jumpToTop } from "../../utils"

export function useScrollTop() {
  const location = useLocation()
  const prevLoc = useRef(location.pathname)

  useEffect(() => {
    if (location.pathname !== prevLoc.current) {
      prevLoc.current = location.pathname
      jumpToTop()
    }
  }, [location.pathname])
}
