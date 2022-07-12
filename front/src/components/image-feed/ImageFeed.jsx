import "./ImageFeed.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

export default function Imagefeed() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [auth, setAuth] = useState(false);
  const [sliderToogle, setSliderToogle] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const staticAddr = `./static/files`;

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    fetch(`/api/files/${page}`)
      .then((res) => res.json())
      .then((res) => {
        !unmounted &&
          setImages((prevImages) => {
            return [...prevImages, ...res.images];
          });
        setHasMore(res.images.length > 0);
        setLoading(false);
      })
      .catch(console.error);
    return () => (unmounted = true);
  }, [page]);

  function checkAuth() {
    fetch("/api/auth")
      .then((response) => response.json())
      .then((response) => {
        setAuth(response.auth);
      })
      .catch((error) => console.error(error));
  }

  function handlerImgClick(e, idx) {
    // document.documentElement.requestFullscreen();
    if (window.screen.width < 600) {
      window.open(e.target.getAttribute("fullimagelink"), "_self");
    } else {
      e.preventDefault();
      setSliderToogle(!sliderToogle);
      setImgIndex(idx);
    }
  }

  function prev() {
    if (imgIndex > 0) {
      setImgIndex(imgIndex - 1);
    }
  }

  function next() {
    if (imgIndex < images.length - 1) {
      setImgIndex(imgIndex + 1);
    }
  }

  function handleKeyboard(e) {
    if (e.keyCode === 38) {
      document.documentElement.requestFullscreen();
    }

    if (e.keyCode === 40) {
      document.exitFullscreen();
      //window.open(`${staticAddr}/${images[imgIndex].filepath}/${images[imgIndex].name}`)
    };
    if (e.keyCode === 27) setSliderToogle(!sliderToogle);
    if (e.keyCode === 39) next();
    if (e.keyCode === 37) prev();
  }

  function handleTouchStart(e) {
    setTouchStartX(e.targetTouches[0].pageX);
    setTouchStartY(e.targetTouches[0].pageY);
  }

  function handleTouchEnd(e) {
    let touchEndX = e.changedTouches[0].pageX;
    let touchEndY = e.changedTouches[0].pageY;

    let deltaX = touchStartX - touchEndX;
    let deltaY = touchEndY - touchStartY;

    console.log(deltaY)
    console.log("delta x is ", deltaX)

    console.log(Document.fullscreenElement )
    if (deltaY > 100) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }

    if (deltaY < -120 && !document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    }

    if (deltaX > 120) {
      prev();
    }

    if (deltaX < -120) {
      next();
    }
  }

  if (sliderToogle) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "scroll";
  }
  
  return (
    <>
      {sliderToogle && (
        <>
          <div
            style={{ zIndex: "11" }}
            className="prev"
            onClick={prev}
            tabIndex="39"
          ></div>
          <div
            className="slider"
            onClick={() => {
              // document.exitFullscreen();
              setSliderToogle(!sliderToogle);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="slider-img"
              style={{ zIndex: "10" }}
            >
              <img
                style={{ zIndex: "10" }}
                src={`${staticAddr}/${images[imgIndex].filepath}/${images[imgIndex].name}`}
              />
            </div>
          </div>
          <div style={{ zIndex: "11" }} className="next" onClick={next}></div>
        </>
      )}

      <div
        className="image-feed-container"
        tabIndex="0"
        onKeyDown={handleKeyboard}
      >
        {auth == true && (
          <Link to="/filemanager" className="upper-menu">
            <div className="filemanager-link">filemanager</div>
          </Link>
        )}
        {images.map((image, index) => {
          let imagepath = !image.filepath ? "" : `/${image.filepath}`;

          if (window.screen.width < 600) {
            console.log("mobile");
          }

          return (
            <div
              ref={lastElementRef}
              className="image-card-feed"
              key={image.name.toString()}
            >
              <img
                className="gallery-item zoom"
                ref={lastElementRef}
                src={`${staticAddr}${imagepath}/thumbnails/${image.name}`}
                fullimagelink={`${staticAddr}${imagepath}/${image.name}`}
                onClick={(e) => handlerImgClick(e, images.indexOf(image))}
              />
            </div>
          );
        })}
        <div className="feed-loader">{loading && "Loading..."}</div>
      </div>
    </>
  );
}
