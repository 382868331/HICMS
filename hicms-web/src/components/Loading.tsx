import loadingGif from '../assets/loading.gif'

function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <img src={loadingGif} alt="加载中..." style={{ width: 120, height: 120, imageRendering: 'auto' }} />
    </div>
  )
}

export default Loading
