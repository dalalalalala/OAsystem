export default {
  namespaced: true,
  state: {
    noteAddStatus:false
  },
  getters: {
    
  },
  mutations: {
    changenoteStatus(state,noteStatus){
      console.log('我执行了。。。')
      state.noteAddStatus = noteStatus
    }
  }
}
