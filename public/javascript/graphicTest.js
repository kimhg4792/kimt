

const state = {
    backend: 'webgl'
  };

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
if (renderPointcloud) {
    state.renderPointcl
    oud = true;
}

function setupDatGui() {
    const gui = new dat.GUI();
    gui.add(state, 'backend', ['webgl', 'wasm'])
        .onChange(async backend => {
          window.cancelAnimationFrame(rafID);
          await tf.setBackend(backend);
          await addFlagLabels();
          landmarksRealTime(video);
        });
  
    if (renderPointcloud) {
      gui.add(state, 'renderPointcloud').onChange(render => {
        document.querySelector('#scatter-gl-container').style.display =
            render ? 'inline-block' : 'none';
      });
    }
  }