export default function File(props) {
  const staticsUrl = "./static/files";
  if (process.env.STATIC_FILES) {
    staticsUrl = process.env.STATIC_FILES;
  }
  
  const fileName = props.file.name;
  const smallThumb = `${staticsUrl}/${props.path}/thumbnails/small/${fileName}`;
  const removeFileHandle = props.removeFileHandle;
  const newPath = props.path ? `${props.path}/` : '';
  return (
    <div className="item-container">
      <div className="item-container-main ">
        <img src={smallThumb} href="#" alt="thumbnail" />
      </div>
      <div className="item-container-bottom">
        <span className="item-container-link">
        <a href={`${staticsUrl}/${newPath}${fileName}`}>
          <svg
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20px"
            height="20px"
          >
            <path
              fill="none"
              stroke="#ddaadd"
              strokeMiterlimit="10"
              strokeWidth="1.5"
              d="M19,20c0,0.551-0.449,1-1,1H6c-0.551,0-1-0.449-1-1V4c0-0.551,0.449-1,1-1h7.586L19,8.414V20z"
            />
            <path d="M18.5 9L13 9 13 3.5z" />
          </svg>
        </a>
        </span>
        <span
          className="remove-button"
          onClick={() => removeFileHandle(`${newPath}${fileName}`)}
        >
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close-circle"
            width="1em"
            height="1em"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
            <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
          </svg>
        </span>
      </div>
    </div>
  );
}
