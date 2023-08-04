import { useSelector } from 'react-redux'
export default function File(props) {
  let staticsUrl = './static/files'
  if (process.env.STATIC_FILES) {
    staticsUrl = process.env.STATIC_FILES
  }

  const path = useSelector((state) => state.fileSystem.currentPath)
  const file = props.file
  const smallThumb = `${staticsUrl}/${file.path}/thumbnails/small/${file.name}`
  const newPath = path ? `${path}/` : ''

  const visibilityButton = () => {
    if (!file.visible) {
      return (
        <svg
          width='1em'
          height='1em'
          xmlns='http://www.w3.org/2000/svg'
          fillRule='evenodd'
          clipRule='evenodd'
        >
          <path d='M8.137 15.147c-.71-.857-1.146-1.947-1.146-3.147 0-2.76 2.241-5 5-5 1.201 0 2.291.435 3.148 1.145l1.897-1.897c-1.441-.738-3.122-1.248-5.035-1.248-6.115 0-10.025 5.355-10.842 6.584.529.834 2.379 3.527 5.113 5.428l1.865-1.865zm6.294-6.294c-.673-.53-1.515-.853-2.44-.853-2.207 0-4 1.792-4 4 0 .923.324 1.765.854 2.439l5.586-5.586zm7.56-6.146l-19.292 19.293-.708-.707 3.548-3.548c-2.298-1.612-4.234-3.885-5.548-6.169 2.418-4.103 6.943-7.576 12.01-7.576 2.065 0 4.021.566 5.782 1.501l3.501-3.501.707.707zm-2.465 3.879l-.734.734c2.236 1.619 3.628 3.604 4.061 4.274-.739 1.303-4.546 7.406-10.852 7.406-1.425 0-2.749-.368-3.951-.938l-.748.748c1.475.742 3.057 1.19 4.699 1.19 5.274 0 9.758-4.006 11.999-8.436-1.087-1.891-2.63-3.637-4.474-4.978zm-3.535 5.414c0-.554-.113-1.082-.317-1.562l.734-.734c.361.69.583 1.464.583 2.296 0 2.759-2.24 5-5 5-.832 0-1.604-.223-2.295-.583l.734-.735c.48.204 1.007.318 1.561.318 2.208 0 4-1.792 4-4z' />
        </svg>
      )
    } else {
      return (
        <svg
          width='24'
          height='20'
          xmlns='http://www.w3.org/2000/svg'
          fillRule='evenodd'
          clipRule='evenodd'
          fill='white'
        >
          <path d='M12.01 20c-5.065 0-9.586-4.211-12.01-8.424 2.418-4.103 6.943-7.576 12.01-7.576 5.135 0 9.635 3.453 11.999 7.564-2.241 4.43-6.726 8.436-11.999 8.436zm-10.842-8.416c.843 1.331 5.018 7.416 10.842 7.416 6.305 0 10.112-6.103 10.851-7.405-.772-1.198-4.606-6.595-10.851-6.595-6.116 0-10.025 5.355-10.842 6.584zm10.832-4.584c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 1c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z' />
        </svg>
      )
    }
  }

  return (
    <div className='item-container'>
      <div className='item-container-main '>
        <img src={smallThumb} href='#' alt='thumbnail' />
      </div>
      <div className='item-container-bottom'>
        <span className='item-link'>
          <a href={`${staticsUrl}/${newPath}${file.name}`}>
            <svg
              fill='#000000'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              width='1em'
              height='1em'
            >
              <path
                fill='#4a4a4a'
                stroke='#8c8c8c'
                strokeMiterlimit='10'
                strokeWidth='1.5'
                d='M19,20c0,0.551-0.449,1-1,1H6c-0.551,0-1-0.449-1-1V4c0-0.551,0.449-1,1-1h7.586L19,8.414V20z'
              />
              <path d='M18.5 9L13 9 13 3.5z' />
            </svg>
          </a>
        </span>

        <span
          className='visibility-button'
          onClick={() => props.changeVisibility(file.id)}
        >
          {visibilityButton()}
        </span>

        <span
          className='remove-button'
          onClick={() => props.remove(`${newPath}${file.name}`)}
        >
          <svg
            viewBox='64 64 900 900'
            focusable='false'
            data-icon='close-circle'
            width='0.9em'
            height='0.9em'
            fill='red'
            aria-hidden='true'
          >
            <path d='M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z'></path>
            <path d='M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z'></path>
          </svg>
        </span>
      </div>
    </div>
  )
}
