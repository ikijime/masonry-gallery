import './ImageFeed.css'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Slider from '../slider/Slider'
import Masonry from 'react-smart-masonry';

const breakpoints = { mobile: 0, mobile2: 600, tablet: 900, desktopSmall: 1200, desktop: 1600 };

export default function Imagefeed() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [auth, setAuth] = useState(false)
  const [sliderToogle, setSliderToogle] = useState(false)
  const [imgIndex, setImgIndex] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const staticAddr = `./static/files`
  const sliderRef = useRef(null)
  const observer = useRef()
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const delta = 6
  let startX
  let startY

  function addClickDetectionHandler() {
    const el = sliderRef.current
    el.addEventListener('mousedown', function (event) {
      startX = event.pageX
      startY = event.pageY
    })

    el.addEventListener('mouseup', function (event) {
      const diffX = Math.abs(event.pageX - startX)
      const diffY = Math.abs(event.pageY - startY)

      if (diffX < delta && diffY < delta) {
        setSliderToogle(!sliderToogle)
      }
    })
  }

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    let unmounted = false
    setLoading(true)
    if (sliderToogle) {
      addClickDetectionHandler()
    }
    fetch(`/api/files/${page}`)
      .then((res) => res.json())
      .then((res) => {
        !unmounted &&
          setImages((prevImages) => {
            let filtered = res.images.filter((item) => item.visible)
            return [...prevImages, ...filtered]
          })
        setHasMore(res.images.length > 0)
        setLoading(false)
      })
      .catch(console.error)
    return () => (unmounted = true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sliderToogle])

  function checkAuth() {
    fetch('/api/auth')
      .then((response) => response.json())
      .then((response) => {
        setAuth(response.auth)
      })
      .catch((error) => console.error(error))
  }

  function handlerImgClick(e, idx) {
    if (window.screen.width < 600) {
      window.open(e.target.getAttribute('fullimagelink'), '_self')
    } else {
      e.preventDefault()
      setSliderToogle(!sliderToogle)
      setImgIndex(idx)
    }
  }

  function prev() {
    if (imgIndex > 0) {
      setImgIndex(imgIndex - 1)
    }
  }

  function next() {
    if (imgIndex < images.length - 1) {
      setImgIndex(imgIndex + 1)
    }
  }

  function handleKeyboard(e) {
    if (e.keyCode === 38) {
      document.documentElement.requestFullscreen()
    }

    if (e.keyCode === 40 && document.fullscreenElement) {
      document.exitFullscreen()
    }

    if (e.keyCode === 40 && !document.fullscreenElement) {
      setSliderToogle(false)
    }

    if (e.keyCode === 27) setSliderToogle(!sliderToogle)
  }

  function handleTouchStart(e) {
    setTouchStartY(e.targetTouches[0].pageY)
  }

  function handleTouchEnd(e) {
    let touchEndY = e.changedTouches[0].pageY

    let deltaY = touchEndY - touchStartY

    if (deltaY > 100) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        setSliderToogle(false)
      }
    }

    if (deltaY < -120 && !document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    }
  }

  if (sliderToogle) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'scroll'
  }

  return (
    <>
      {auth === true && (
        <div>
        <Link to='/filemanager' className='upper-menu'>
          <div 
            className='filemanager-link'>
            Filemanager
          </div>
        </Link>
          <div className="spacer"></div>
        </div>
      )}

<div className='contacts'>
        {/* <span style={{ fontSize: 16 }}>email:&nbsp;</span>
        <a href='mailto:test@localhost.lan'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            stroke='#375669'
            fill='#2f79be'
          >
            <path d='M12.042 23.648c-7.813 0-12.042-4.876-12.042-11.171 0-6.727 4.762-12.125 13.276-12.125 6.214 0 10.724 4.038 10.724 9.601 0 8.712-10.33 11.012-9.812 6.042-.71 1.108-1.854 2.354-4.053 2.354-2.516 0-4.08-1.842-4.08-4.807 0-4.444 2.921-8.199 6.379-8.199 1.659 0 2.8.876 3.277 2.221l.464-1.632h2.338c-.244.832-2.321 8.527-2.321 8.527-.648 2.666 1.35 2.713 3.122 1.297 3.329-2.58 3.501-9.327-.998-12.141-4.821-2.891-15.795-1.102-15.795 8.693 0 5.611 3.95 9.381 9.829 9.381 3.436 0 5.542-.93 7.295-1.948l1.177 1.698c-1.711.966-4.461 2.209-8.78 2.209zm-2.344-14.305c-.715 1.34-1.177 3.076-1.177 4.424 0 3.61 3.522 3.633 5.252.239.712-1.394 1.171-3.171 1.171-4.529 0-2.917-3.495-3.434-5.246-.134z' />
          </svg>
        </a>
        <span>&nbsp;&nbsp;&nbsp;</span> */}
        <div className='tg-icon'>
        <span style={{ fontSize: '18' }}></span> &nbsp;
        <a href='tg://resolve?domain=#'>
          <svg className='tg-svg'
            width='24px'
            height='24px'
            version='1.1'
            viewBox='0 0 1e3 1e3'
            xmlns='http://www.w3.org/2000/svg'
          >
            <title>telegram</title>
            <defs>
              <linearGradient
                id='linearGradient-1'
                x1='10%'
                x2='30%'
                y2='99.258%'
              >
                <stop stopColor='#5593a6' offset='0' />
                <stop stopColor='#2f79bf' offset='1' />
              </linearGradient>
            </defs>
            <g id='Artboard' fillRule='evenodd'>
              <circle
                id='Oval'
                cx='500'
                cy='500'
                r='500'
                fill='url(#linearGradient-1)'
              />
              <path
                d='m226.33 494.72c145.76-63.505 242.96-105.37 291.59-125.6 138.86-57.755 167.71-67.787 186.51-68.119 4.1362-0.072862 13.384 0.95221 19.375 5.8132 5.0584 4.1045 6.4501 9.6491 7.1161 13.541 0.666 3.8915 1.4953 12.756 0.83608 19.683-7.5246 79.062-40.084 270.92-56.648 359.47-7.0089 37.469-20.81 50.032-34.17 51.262-29.036 2.6719-51.085-19.189-79.207-37.624-44.007-28.847-68.867-46.804-111.58-74.953-49.366-32.531-17.364-50.411 10.769-79.631 7.3626-7.6471 135.3-124.01 137.77-134.57 0.30968-1.3202 0.59708-6.2414-2.3265-8.8399s-7.2385-1.7099-10.352-1.0032c-4.4137 1.0017-74.715 47.468-210.9 139.4-19.955 13.702-38.029 20.379-54.223 20.029-17.853-0.3857-52.194-10.094-77.723-18.393-31.313-10.178-56.199-15.56-54.032-32.846 1.1287-9.0037 13.528-18.212 37.197-27.624z'
                fill='#FFFFFF'
              />
            </g>
          </svg>
        </a>
        </div>
      </div>

      <div
        className='image-feed-container'
        tabIndex='0'
        onKeyDown={handleKeyboard}
      >
        {sliderToogle && (
          <div>
            {' '}
            <div
              style={{ zIndex: '11' }}
              className='prev'
              onClick={prev}
              tabIndex='39'
            ></div>
            <div
              ref={sliderRef}
              className='slider'
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <Slider
                onSlideComplete={(i) => {
                  setImgIndex(i)
                }}
                onSlideStart={(i) => {}}
                activeIndex={imgIndex}
                threshHold={100}
                transition={0.3}
                scaleOnDrag={false}
              >
                {images.map((image, index) => (
                  <img
                    src={`${staticAddr}/${image.path}/${image.name}`}
                    key={index}
                    loading='lazy'
                    alt={image.name}
                  />
                ))}
              </Slider>
            </div>
            <div style={{ zIndex: '11' }} className='next' onClick={next}></div>
          </div>
        )}


        <Masonry 
          breakpoints={breakpoints}
          // autoArrange={true}
          columns={{ mobile: 1, mobile2: 3, tablet: 4, desktopSmall: 6, desktop: 8 }}
          gap={{ mobile: 5, mobile2: 5, tablet: 10, desktopSmall: 15, desktop: 20 }}
        >{images.map((image) => {
          let imagepath = !image.path ? '' : `/${image.path}`

          if (!image.visible) return ''

          return (
            <div
              ref={lastElementRef}
              className='image-card-feed'
              key={image.name.toString()}
            >
              <img
                className='gallery-item zoom'
                ref={lastElementRef}
                src={`${staticAddr}${imagepath}/thumbnails/${image.name}`}
                fullimagelink={`${staticAddr}${imagepath}/${image.name}`}
                onClick={(e) => handlerImgClick(e, images.indexOf(image))}
                loading='lazy'
                alt={image.name}
              />
            </div>
          )
        })}
        </Masonry>

        {loading && <div className='feed-loader'>Loading...</div>}
      </div>

      
    </>
  )
}
