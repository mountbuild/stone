
function stone() {

  let SLICE = 1

  /**
   * Create a 16KB slot of memory for our system to start.
   */

  const MOUNT = new Uint32Array({ store })

  /**
   * The native elements.
   */

  const BUILD = [[]]

  /**
   * The native functions or "system calls".
   */

  const FORCE = []

  /**
   * What you get back.
   */

  const STORE = [MOUNT, BUILD, FORCE]

  /**
   * The start of the stack chain.
   */

  const STACK_START = 0

  /**
   * The active stack.
   */

  const STACK_MOUNT = 1

  /**
   * The next call.
   */

  const FRONT = 0

  const STACK = 1
  const STICK = 2
  const DRIVE = 3 // chain

  /**
   * The timestamp when we started the next main loop.
   */

  const CLOCK_START = 10

  /**
   * The timestamp when we completed a block of the main loop.
   */

  const CLOCK_FRONT = 4

  /**
   * The maximum number of milliseconds before we
   * start a new loop in the main loop.
   */

   const CLOCK_CREST = 5

  /**
   * Whether or not we have surpassed the max time
   * for the main loop, so we know when to exit.
   */

  const CLOCK_LATCH = 6

  /**
   * The maximum number of loops in the main loop.
   */

  const SHIFT_CREST = 7

  /**
   * The total number of iterations in the main loop,
   * so we know when to finish up.
   */

  const SHIFT_COUNT = 8

  /**
   * A flag saying whether or not we jumped to a new call,
   * or we jump over the current action to the next action
   * in sequence.
   */

  const SHIFT = 9

  /**
   * This is the index to the setImmediate function.
   */

  const CAUSE_VAULT = 32

  /**
   * This is the initial value of the SHIFT flag.
   */

  const SHIFT_CLEAR = 0

  /**
   * Start processing.
   */

  force(function(){
    MOUNT[CLOCK_CREST] = 8
    MOUNT[CLOCK_START] = Date.now()
    MOUNT[CLOCK_LATCH] = 0
    MOUNT[SHIFT_CREST] = 65536
    MOUNT[SHIFT_COUNT] = 0

    /**
     * If we haven't reached the time limit,
     * then do one more block of loops.
     */

    while (!MOUNT[CLOCK_LATCH]) {

      /**
       * If we haven't reached the limit of
       * iteraction per clock cycle, then do one more loop.
       */

      while (MOUNT[SHIFT_COUNT] < MOUNT[SHIFT_CREST]) {

        /**
         * Find the next cause in the sequence.
         */

        const front = MOUNT[FRONT]

        /**
         * Increment iteration counter.
         */

        MOUNT[SHIFT_COUNT]++

        /**
         * Get the cause index.
         */

        const slate = MOUNT[front]

        if (!slate) {
          return
        }

        /**
         * Get the cause.
         */

        const cause = FORCE[slate]

        const pad = String(MOUNT[SHIFT_COUNT]).padStart(5, ' ')
        console.log(`${pad}. ${cause.name}()`)
        SLICE++

        /**
         * Invoke the cause.
         */

        cause()

        /**
         * That stack function could have
         * caused a jump to a new function.
         */

        if (MOUNT[SHIFT]) {

          /**
           * Reset the jump flag if we jumped.
           */

          MOUNT[SHIFT] = SHIFT_CLEAR
        } else {

          /**
           * Otherwise, just jump to the next
           * mount build action in sequence.
           */

          MOUNT[FRONT] += MOUNT[front + 1]
        }

        SLICE--
      }

      MOUNT[CLOCK_FRONT] = Date.now()
      const clock_start = MOUNT[CLOCK_START]
      const clock_front = MOUNT[CLOCK_FRONT]
      const clock_crest = MOUNT[CLOCK_CREST]
      const clock_shift = clock_front - clock_start
      const clock_latch = clock_shift > clock_crest
      MOUNT[CLOCK_LATCH] = clock_latch
    }

    FORCE[CAUSE_VAULT](FORCE[0])
  })

  /**
   * Call with zero inputs and no return.
   */

  force(function mount_0(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const cause = FORCE[force_00000]
    CAUSE(cause)
  })

  /**
   * Call with 1 input and no return.
   */

  force(function mount_1(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const state_00001 = MOUNT[front + 4]
    const fetch_00001 = FORCE[force_00001 + 24]
    const cause = FORCE[force_00000]
    CAUSE(cause, fetch_00001, state_00001)
  })

  force(function mount_2(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002
    )
  })

  force(function mount_3(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const fetch_00003 = FORCE[force_00003 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003
    )
  })

  force(function(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const fetch_00003 = FORCE[force_00003 + 24]
    const fetch_00004 = FORCE[force_00004 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004
    )
  })

  force(function(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const fetch_00003 = FORCE[force_00003 + 24]
    const fetch_00004 = FORCE[force_00004 + 24]
    const fetch_00005 = FORCE[force_00005 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005
    )
  })

  force(function(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const force_00006 = MOUNT[front + 13]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const state_00006 = MOUNT[front + 14]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const fetch_00003 = FORCE[force_00003 + 24]
    const fetch_00004 = FORCE[force_00004 + 24]
    const fetch_00005 = FORCE[force_00005 + 24]
    const fetch_00006 = FORCE[force_00006 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005,
      fetch_00006, state_00006
    )
  })

  force(function(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const force_00006 = MOUNT[front + 13]
    const force_00007 = MOUNT[front + 15]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const state_00006 = MOUNT[front + 14]
    const state_00007 = MOUNT[front + 16]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const fetch_00003 = FORCE[force_00003 + 24]
    const fetch_00004 = FORCE[force_00004 + 24]
    const fetch_00005 = FORCE[force_00005 + 24]
    const fetch_00006 = FORCE[force_00006 + 24]
    const fetch_00007 = FORCE[force_00007 + 24]
    const cause = FORCE[force_00000]
    CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005,
      fetch_00006, state_00006,
      fetch_00007, state_00007
    )
  })

  force(function mount_0_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const store = FORCE[force_00001 + 24]
    const slate = MOUNT[front + 4]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause
    )
    WRITE(store, build, slate)
  })

  force(function mount_1_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const state_00001 = MOUNT[front + 4]
    const fetch_00001 = FORCE[force_00001 + 24]
    const store = FORCE[force_00002 + 24]
    const slate = MOUNT[front + 6]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001
    )
    WRITE(store, build, slate)
  })

  force(function mount_2_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const fetch_00001 = FORCE[force_00001 + 24]
    const fetch_00002 = FORCE[force_00002 + 24]
    const store = FORCE[force_00003 + 24]
    const slate = MOUNT[front + 8]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002
    )
    WRITE(store, build, slate)
  })

  force(function mount_3_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const fetch_00001 = FORCE[force_00001]
    const fetch_00002 = FORCE[force_00002]
    const fetch_00003 = FORCE[force_00003]
    const store = FORCE[force_00004 + 24]
    const slate = MOUNT[front + 10]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003
    )
    WRITE(store, build, slate)
  })

  force(function mount_4_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const fetch_00001 = FORCE[force_00001]
    const fetch_00002 = FORCE[force_00002]
    const fetch_00003 = FORCE[force_00003]
    const fetch_00004 = FORCE[force_00004]
    const store = FORCE[force_00005 + 24]
    const slate = MOUNT[front + 12]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004
    )
    WRITE(store, build, slate)
  })

  force(function mount_5_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const force_00006 = MOUNT[front + 13]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const fetch_00001 = FORCE[force_00001]
    const fetch_00002 = FORCE[force_00002]
    const fetch_00003 = FORCE[force_00003]
    const fetch_00004 = FORCE[force_00004]
    const fetch_00005 = FORCE[force_00005]
    const store = FORCE[force_00006 + 24]
    const slate = MOUNT[front + 14]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005
    )
    WRITE(store, build, slate)
  })

  force(function mount_6_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const force_00006 = MOUNT[front + 13]
    const force_00007 = MOUNT[front + 15]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const state_00006 = MOUNT[front + 14]
    const fetch_00001 = FORCE[force_00001]
    const fetch_00002 = FORCE[force_00002]
    const fetch_00003 = FORCE[force_00003]
    const fetch_00004 = FORCE[force_00004]
    const fetch_00005 = FORCE[force_00005]
    const fetch_00006 = FORCE[force_00006]
    const store = FORCE[force_00007 + 24]
    const slate = MOUNT[front + 16]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005,
      fetch_00006, state_00006
    )
    WRITE(store, build, slate)
  })

  force(function mount_7_shift(){
    const front = MOUNT[FRONT]
    const force_00000 = MOUNT[front + 2]
    const force_00001 = MOUNT[front + 3]
    const force_00002 = MOUNT[front + 5]
    const force_00003 = MOUNT[front + 7]
    const force_00004 = MOUNT[front + 9]
    const force_00005 = MOUNT[front + 11]
    const force_00006 = MOUNT[front + 13]
    const force_00007 = MOUNT[front + 15]
    const force_00008 = MOUNT[front + 15]
    const state_00001 = MOUNT[front + 4]
    const state_00002 = MOUNT[front + 6]
    const state_00003 = MOUNT[front + 8]
    const state_00004 = MOUNT[front + 10]
    const state_00005 = MOUNT[front + 12]
    const state_00006 = MOUNT[front + 14]
    const state_00007 = MOUNT[front + 16]
    const fetch_00001 = FORCE[force_00001]
    const fetch_00002 = FORCE[force_00002]
    const fetch_00003 = FORCE[force_00003]
    const fetch_00004 = FORCE[force_00004]
    const fetch_00005 = FORCE[force_00005]
    const fetch_00006 = FORCE[force_00006]
    const fetch_00007 = FORCE[force_00007]
    const store = FORCE[force_00008 + 24]
    const slate = MOUNT[front + 18]
    const cause = FORCE[force_00000]
    const build = CAUSE(
      cause,
      fetch_00001, state_00001,
      fetch_00002, state_00002,
      fetch_00003, state_00003,
      fetch_00004, state_00004,
      fetch_00005, state_00005,
      fetch_00006, state_00006,
      fetch_00007, state_00007
    )
    WRITE(store, build, slate)
  })


  force(function shift_match(s, h, o){
    if (s === h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  force(function shift_shift_match(s, h, o){
    if (s !== h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  force(function shift_crest(s, h, o){
    if (s > h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  force(function shift_floor(s, h, o){
    if (s < h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  /**
   * Jump gte.
   */

  force(function(s, h, o){
    if (s >= h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  /**
   * Jump lte.
   */

  force(function(s, h, o){
    if (s <= h) {
      MOUNT[FRONT] = o
      MOUNT[SHIFT] = 1
    }
  })

  /**
   * Jump.
   */

  force(function shift(s){
    MOUNT[FRONT] = s
    MOUNT[SHIFT] = 1
  })

  /**
   * fetch
   */

  force(function fetch(s){
    return s
  })

  /**
   * fetch-mount
   */

  force(function fetch_mount(s){
    return MOUNT[s]
  })

  /**
   * fetch-build
   */

  force(function fetch_build(s){
    return BUILD[s]
  })

  /**
   * fetch-mount
   */

  force(function fetch_mount_stack(s){
    // stack=<scale><crest><shift><values...>
    const stack = MOUNT[STACK]
    return MOUNT[stack + s + 3]
  })

  /**
   * store-mount-build
   */

  force(function store_mount_state(s, h){
    const stack = MOUNT[STACK]
    MOUNT[stack + h + 3] = s
  })

  /**
   * store-stack-mount-build
   */

  force(function store_mount_state_2(s, h){
    const stack = MOUNT[STACK]
    MOUNT[stack + s + 3] = h
  })

  /**
   * store-stick-mount-build
   */

  force(function(s, h, o){
    let stick = MOUNT[STICK]
    while (s) {
      stick = MOUNT[stick]
      s--
    }
    const slate = MOUNT[stick + 1]
    const store = BUILD[slate]
    store[h] = o
  })

  /**
   * store-stack-share-mount
   */

   force(function(s, h){
    const stack = MOUNT[STACK]
    MOUNT[stack + s] = MOUNT[h]
  })

  /**
   * store-stick-share-mount
   */

  force(function(s, h, o){
    throw 'oops'
  })

  /**
   * store-mount-share-build
   */

  force(function store_mount_share_build(s, h){
    MOUNT[s] = BUILD[h]
  })

  /**
   * store-build-share-mount
   */

  force(function store_build_share_mount(s, h){
    BUILD[s] = MOUNT[h]
  })

  /**
   * Push activation record.
   *
   * mount-stack
   */

  force(function mount_stack(s){

    /**
     * Get the last drive address.
     */

    const crest = MOUNT[STACK]

    /**
     * Increment the drive pointer by however
     * large the last was.
     */

    MOUNT[STACK] += MOUNT[crest]

    /**
     * Now the new position is where the drive starts.
     */

    const start = MOUNT[STACK]

    /**
     * Set the size of the drive to what we passed in.
     */

    MOUNT[start] = s

    /**
     * And set the pointer to the parent drive.
     * This is used for lookup.
     */

    MOUNT[start + 1] = crest
  })

  /**
   * Pop activation record.
   *
   * clear-stack
   */

  force(function clear_stack(){

    /**
     * Get the front of the stack.
     */

    const start = MOUNT[STACK]

    /**
     * Get the return address.
     */

    const shift = MOUNT[start + 2]

    /**
     * Redirect back to the return address.
     */

    MOUNT[FRONT] = shift

    /**
     * Get the size of the activation record.
     */

    const crest = MOUNT[start + 1]

    /**
     * Get scale from crest.
     */

    const scale = MOUNT[crest]

    /**
     * Decrement by that value.
     */

    MOUNT[STACK] -= scale
  })

  /**
   * Call a function but also pass the return address.
   */

  force(function cause(s){

    /**
     * Get the current stack pointer.
     */

    const drive = MOUNT[STACK]

    /**
     * Set the return address to the next cause
     * in the sequence.
     */

    MOUNT[drive + 2] = MOUNT[FRONT] + 2

    /**
     * Then jump to what was provided.
     */

    MOUNT[FRONT] = s
  })

  /**
   * Store in a place in native memory.
   */

  force(function(s, h, o){
    let house = MOUNT[SLACK]
    while (s) {
      house = MOUNT[house]
      s--
    }
    let store = BUILD[house]
    let build = store[h]
    let stack = MOUNT[STACK]
    MOUNT[stack + o] = build
  })

  /**
   * Clear a place in native memory.
   */

  force(function(s){

  })

  force(function(){
    let front = MOUNT[FRONT] + 2
    const count = MOUNT[front]
    const chain = new Array(count)
    front++
    let bound = 0
    while (bound < count) {
      const mount = bound / 4
      const block = MOUNT[front + mount]
      const a = block & 0x000000ff
      const b = (block & 0x0000ff00) >> 8
      const c = (block & 0x00ff0000) >> 16
      const d = (block & 0xff000000) >> 24
      chain[bound] = String.fromCharCode(a)
      chain[bound + 1] = String.fromCharCode(b)
      chain[bound + 2] = String.fromCharCode(c)
      chain[bound + 3] = String.fromCharCode(d)
      bound += 4
    }
  })
  { build }

  function force(w) {
    FORCE.push(w)
  }

  const build = {
    store: STORE,
    mount: () => FORCE[BUILD_MOUNT](),
    drive: () => FORCE[0](),
    cause: (i, ...args) => FORCE[i](...args)
  }

  return build

  function CAUSE() {
    let args = Array.prototype.slice.call(arguments)
    let cause = args.shift()
    let newArgs = []
    let callArgs = []
    for (let i = 0, n = args.length; i < n; i += 2) {
      let a = args[i]
      let b = args[i + 1]
      let c = a(b)
      newArgs.push(c)
      callArgs.push(`${a.name}(${b}) => ${c}`)
    }
    const shift = (new Array(SLICE)).join('  ')
    const pad = String(MOUNT[SHIFT_COUNT]).padStart(5, ' ')
    console.log(`${shift}${pad}. ${cause.name}(${callArgs.join(', ')})`)
    SLICE++
    let build = cause.apply(null, newArgs)
    SLICE--
    return build
  }

  function WRITE(s, h, o) {
    const shift = (new Array(SLICE)).join('  ')
    const pad = String(MOUNT[SHIFT_COUNT]).padStart(5, ' ')
    console.log(`${shift}${pad}. ${s.name}(${h}, ${o})`)
    s(h, o)
  }
}

if (typeof module !== 'undefined') {
  module.exports = stone
}
