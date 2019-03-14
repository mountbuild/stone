
function stone() {

  let SLICE = 1

  /**
   * Create a 16KB slot of memory for our system to start.
   */

  const MOUNT = new Uint32Array([
    0x00100, 0x0001c, 0x00024, 0x0002c, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00008, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00020, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00002, 0x00005, 0x00023, 0x00000, 0x00010, 0x0000b, 0x00009, 0x00068,
    0x00000, 0x00001, 0x00000, 0x00002, 0x00004, 0x00000, 0x0000b, 0x00009,
    0x00068, 0x00000, 0x00003, 0x00003, 0x00000, 0x00004, 0x00001, 0x0000b,
    0x00009, 0x00068, 0x00000, 0x0000a, 0x00000, 0x00014, 0x00004, 0x00003,
    0x0000b, 0x00009, 0x0006b, 0x00003, 0x00001, 0x00003, 0x00000, 0x00004,
    0x00002, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00000, 0x00002, 0x00005,
    0x000a2, 0x00003, 0x00001, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00002,
    0x00002, 0x00005, 0x000a2, 0x00003, 0x00003, 0x00002, 0x00005, 0x000a2,
    0x00003, 0x00000, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00001, 0x00002,
    0x00005, 0x000a2, 0x00003, 0x00002, 0x00002, 0x00005, 0x000a2, 0x00003,
    0x00003, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00000, 0x00002, 0x00005,
    0x000a2, 0x00003, 0x00001, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00002,
    0x00002, 0x00005, 0x000a2, 0x00003, 0x00003, 0x00002, 0x00005, 0x000a2,
    0x00003, 0x00000, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00001, 0x00002,
    0x00005, 0x000a2, 0x00003, 0x00002, 0x00002, 0x00005, 0x000a2, 0x00003,
    0x00003, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00000, 0x00002, 0x00005,
    0x000a2, 0x00003, 0x00001, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00002,
    0x00002, 0x00005, 0x000a2, 0x00003, 0x00003, 0x00002, 0x00005, 0x000a2,
    0x00003, 0x00000, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00001, 0x00002,
    0x00005, 0x000a2, 0x00003, 0x00002, 0x00002, 0x00005, 0x000a2, 0x00003,
    0x00003, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00000, 0x00002, 0x00005,
    0x000a2, 0x00003, 0x00001, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00002,
    0x00002, 0x00005, 0x000a2, 0x00003, 0x00003, 0x00002, 0x00005, 0x000a2,
    0x00003, 0x00000, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00001, 0x00002,
    0x00005, 0x000a2, 0x00003, 0x00002, 0x00002, 0x00005, 0x000a2, 0x00003,
    0x00003, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00000, 0x00002, 0x00005,
    0x000a2, 0x00003, 0x00001, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00002,
    0x00002, 0x00005, 0x000a2, 0x00003, 0x00003, 0x00002, 0x00005, 0x000a2,
    0x00003, 0x00000, 0x00002, 0x00005, 0x000a2, 0x00003, 0x00001, 0x00002,
    0x00005, 0x000a2, 0x00003, 0x00002, 0x00002, 0x00005, 0x000a2, 0x00003,
    0x00003, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000,
    0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000, 0x00000
  ])

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
    
  /**
   * @mount/drive/javascript/binding/base#drive 1
   */
  
  force(function force_drive(s, h){
    while (s()) {
      h()
    }
  })
  
  /**
   * @mount/drive/javascript/binding/base#check 2
   */
  
  force(function force_check(s, h){
    if (s()) {
      return h()
    }
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-else 3
   */
  
  force(function force_check_else(s, h, o){
    if (s()) {
      return h()
    } else {
      return o()
    }
  })
  
  /**
   * @mount/drive/javascript/binding/base#debug-function 4
   */
  
  force(function force_debug_function(s){
    window.debug(s)
  })
  
  /**
   * @mount/drive/javascript/binding/base#debug 5
   */
  
  force(function force_debug(){
    debugger
  })
  
  /**
   * @mount/drive/javascript/binding/base#queue 6
   */
  
  force(function force_queue(s){
    window.setImmediate(s)
  })
  
  /**
   * @mount/drive/javascript/binding/base#compute-bitwise-or 7
   */
  
  force(function force_compute_bitwise_or(s, h){
    return s | h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-if-equal 8
   */
  
  force(function force_check_if_equal(s, h){
    return s == h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-if-strictly-equal 9
   */
  
  force(function force_check_if_strictly_equal(s, h){
    return s === h
  })
  
  /**
   * @mount/drive/javascript/binding/base#get-typeof 10
   */
  
  force(function force_get_typeof(s){
    return typeof s
  })
  
  /**
   * @mount/drive/javascript/binding/base#get-instanceof 11
   */
  
  force(function force_get_instanceof(s, h){
    return s instanceof h
  })
  
  /**
   * @mount/drive/javascript/binding/base#set-field 12
   */
  
  force(function force_set_field(s, h, o){
    s[h] = o
  })
  
  /**
   * @mount/drive/javascript/binding/base#get-field 13
   */
  
  force(function force_get_field(s, h){
    return s[h]
  })
  
  /**
   * @mount/drive/javascript/binding/base#remove-field 14
   */
  
  force(function force_remove_field(s, h){
    delete s[h]
  })
  
  /**
   * @mount/drive/javascript/binding/base#shift-left 15
   */
  
  force(function force_shift_left(s, h){
    return s << h
  })
  
  /**
   * @mount/drive/javascript/binding/base#shift-right 16
   */
  
  force(function force_shift_right(s, h){
    return s >> h
  })
  
  /**
   * @mount/drive/javascript/binding/base#shift-right-unsigned 17
   */
  
  force(function force_shift_right_unsigned(s, h){
    return s >>> h
  })
  
  /**
   * @mount/drive/javascript/binding/base#compute-bitwise-and 18
   */
  
  force(function force_compute_bitwise_and(s, h){
    return s & h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-or 19
   */
  
  force(function force_check_or(s, h){
    return s || h
  })
  
  /**
   * @mount/drive/javascript/binding/base#try-catch 20
   */
  
  force(function force_try_catch(s, h){
    try {
      return s()
    } catch (e) {
      return h(e)
    }
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-if-truthy 21
   */
  
  force(function force_check_if_truthy(s){
    return !!s
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-opposite 22
   */
  
  force(function force_check_opposite(s){
    return !s
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-not-equal 23
   */
  
  force(function force_check_not_equal(s, h){
    return s !== h
  })
  
  /**
   * @mount/drive/javascript/binding/base#flip-block 24
   */
  
  force(function force_flip_block(s){
    return ~s
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-gt 25
   */
  
  force(function force_check_gt(s, h){
    return s > h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-lt 26
   */
  
  force(function force_check_lt(s, h){
    return s < h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-gte 27
   */
  
  force(function force_check_gte(s, h){
    return s >= h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-lte 28
   */
  
  force(function force_check_lte(s, h){
    return s <= h
  })
  
  /**
   * @mount/drive/javascript/binding/base#check-and 29
   */
  
  force(function force_check_and(s, h){
    return s && h
  })  
  /**
   * @mount/drive/javascript/binding/string#replace 30
   */
  
  force(function force_replace(s, h, o){
    return s.replace(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/string#trim 31
   */
  
  force(function force_trim(s){
    return s.trim()
  })
  
  /**
   * @mount/drive/javascript/binding/string#get-char-code-at 32
   */
  
  force(function force_get_char_code_at(s, h){
    return s.charCodeAt(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#get-char-at 33
   */
  
  force(function force_get_char_at(s, h){
    return s.charAt(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#get-char-from-code 34
   */
  
  force(function force_get_char_from_code(s){
    return String.fromCharCode(s)
  })
  
  /**
   * @mount/drive/javascript/binding/string#get-char-from-code-point 35
   */
  
  force(function force_get_char_from_code_point(s){
    return String.fromCodePoint(s)
  })
  
  /**
   * @mount/drive/javascript/binding/string#convert-to-lowercase 36
   */
  
  force(function force_convert_to_lowercase(s){
    return s.toLowerCase()
  })
  
  /**
   * @mount/drive/javascript/binding/string#convert-to-uppercase 37
   */
  
  force(function force_convert_to_uppercase(s){
    return s.toUpperCase()
  })
  
  /**
   * @mount/drive/javascript/binding/string#create 38
   */
  
  force(function force_create(){
    return ''
  })
  
  /**
   * @mount/drive/javascript/binding/string#match 39
   */
  
  force(function force_match(s, h){
    return s.match(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#create-collator 40
   */
  
  force(function force_create_collator(){
    return new Intl.Collator()
  })
  
  /**
   * @mount/drive/javascript/binding/string#get-collator-comparator 41
   */
  
  force(function force_get_collator_comparator(s){
    return s.compare
  })
  
  /**
   * @mount/drive/javascript/binding/string#split 42
   */
  
  force(function force_split(s, h){
    return s.split(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#check-starts-with 43
   */
  
  force(function force_check_starts_with(s, h){
    return s.startsWith(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#check-ends-with 44
   */
  
  force(function force_check_ends_with(s, h){
    return s.endsWith(h)
  })
  
  /**
   * @mount/drive/javascript/binding/string#pad-start 45
   */
  
  force(function force_pad_start(s, h, o){
    return s.padStart(h, o)
  })  
  /**
   * @mount/drive/javascript/binding/number#parse-decimal 46
   */
  
  force(function force_parse_decimal(s){
    return window.parseFloat(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#parse-int 47
   */
  
  force(function force_parse_int(s){
    return window.parseInt(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#parse-number 48
   */
  
  force(function force_parse_number(s){
    return window.Number(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-max 49
   */
  
  force(function force_get_max(s, h){
    return Math.max(s, h)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-min 50
   */
  
  force(function force_get_min(s, h){
    return Math.max(s, h)
  })
  
  /**
   * @mount/drive/javascript/binding/number#floor 51
   */
  
  force(function force_floor(s){
    return Math.floor(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#ceil 52
   */
  
  force(function force_ceil(s){
    return Math.ceil(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#round 53
   */
  
  force(function force_round(s){
    return Math.round(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-abs 54
   */
  
  force(function force_get_abs(s){
    return Math.abs(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-cos 55
   */
  
  force(function force_get_cos(s){
    return Math.cos(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-acos 56
   */
  
  force(function force_get_acos(s){
    return Math.acos(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-sin 57
   */
  
  force(function force_get_sin(s){
    return Math.sin(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-asin 58
   */
  
  force(function force_get_asin(s){
    return Math.asin(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-tan 59
   */
  
  force(function force_get_tan(s){
    return Math.tan(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-atan 60
   */
  
  force(function force_get_atan(s){
    return Math.atan(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-atan2 61
   */
  
  force(function force_get_atan2(s){
    return Math.atan2(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-log 62
   */
  
  force(function force_get_log(s){
    return Math.log(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-sqrt 63
   */
  
  force(function force_get_sqrt(s){
    return Math.sqrt(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#add 64
   */
  
  force(function force_add(s, h){
    return s + h
  })
  
  /**
   * @mount/drive/javascript/binding/number#subtract 65
   */
  
  force(function force_subtract(s, h){
    return s - h
  })
  
  /**
   * @mount/drive/javascript/binding/number#multiply 66
   */
  
  force(function force_multiply(s, h){
    return s * h
  })
  
  /**
   * @mount/drive/javascript/binding/number#divide 67
   */
  
  force(function force_divide(s, h){
    return s / h
  })
  
  /**
   * @mount/drive/javascript/binding/number#modulus 68
   */
  
  force(function force_modulus(s, h){
    return s % h
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-exponent 69
   */
  
  force(function force_get_exponent(s, h){
    return s ** h
  })
  
  /**
   * @mount/drive/javascript/binding/number#increment 70
   */
  
  force(function force_increment(s){
    return ++s
  })
  
  /**
   * @mount/drive/javascript/binding/number#decrement 71
   */
  
  force(function force_decrement(s){
    return --s
  })
  
  /**
   * @mount/drive/javascript/binding/number#check-if-not-number 72
   */
  
  force(function force_check_if_not_number(s){
    return window.isNaN(s)
  })
  
  /**
   * @mount/drive/javascript/binding/number#get-random 73
   */
  
  force(function force_get_random(){
    return Math.random()
  })
  
  /**
   * @mount/drive/javascript/binding/number#loop 74
   */
  
  force(function force_loop(s, h, o){
    for (s; s < h; s++) {
      x[0][o](s)
    }
  })  
  /**
   * @mount/drive/javascript/binding/function#create 75
   */
  
  force(function force_create(s){
    return new Function(s)
  })  
  /**
   * @mount/drive/javascript/binding/array#get-index-of 76
   */
  
  force(function force_get_index_of(s, h){
    return s.indexOf(h)
  })
  
  /**
   * @mount/drive/javascript/binding/array#create 77
   */
  
  force(function force_create(){
    return []
  })
  
  /**
   * @mount/drive/javascript/binding/array#create-uint8 78
   */
  
  force(function force_create_uint8(s){
    return new Uint8Array(s)
  })
  
  /**
   * @mount/drive/javascript/binding/array#create-uint16 79
   */
  
  force(function force_create_uint16(s){
    return new Uint16Array(s)
  })
  
  /**
   * @mount/drive/javascript/binding/array#create-uint32 80
   */
  
  force(function force_create_uint32(s){
    return new Uint32Array(s)
  })
  
  /**
   * @mount/drive/javascript/binding/array#create-float32 81
   */
  
  force(function force_create_float32(s){
    return new Float32Array(s)
  })
  
  /**
   * @mount/drive/javascript/binding/array#push 82
   */
  
  force(function force_push(s, h){
    s.push(h)
  })
  
  /**
   * @mount/drive/javascript/binding/array#pop 83
   */
  
  force(function force_pop(s){
    return s.pop()
  })
  
  /**
   * @mount/drive/javascript/binding/array#shift 84
   */
  
  force(function force_shift(s){
    return s.shift()
  })
  
  /**
   * @mount/drive/javascript/binding/array#unshift 85
   */
  
  force(function force_unshift(s, h){
    s.unshift(h)
  })
  
  /**
   * @mount/drive/javascript/binding/array#store 86
   */
  
  force(function force_store(s, h, o){
    s[h] = o
  })
  
  /**
   * @mount/drive/javascript/binding/array#fetch 87
   */
  
  force(function force_fetch(s, h){
    return s[h]
  })
  
  /**
   * @mount/drive/javascript/binding/array#get-length 88
   */
  
  force(function force_get_length(s){
    return s.length
  })  
  /**
   * @mount/drive/javascript/binding/dataview#build-data-view 89
   */
  
  force(function force_build_data_view(s, h, o){
    return new DataView(s, h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-int8 90
   */
  
  force(function force_get_int8(s, h, o){
    return s.getInt8(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-uint8 91
   */
  
  force(function force_get_uint8(s, h, o){
    return s.getUint8(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-int16 92
   */
  
  force(function force_get_int16(s, h, o){
    return s.getInt16(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-uint16 93
   */
  
  force(function force_get_uint16(s, h, o){
    return s.getUint16(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-int32 94
   */
  
  force(function force_get_int32(s, h, o){
    return s.getInt32(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-uint32 95
   */
  
  force(function force_get_uint32(s, h, o){
    return s.getUint32(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-float32 96
   */
  
  force(function force_get_float32(s, h, o){
    return s.getFloat32(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-float64 97
   */
  
  force(function force_get_float64(s, h, o){
    return s.getFloat64(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-big-int64 98
   */
  
  force(function force_get_big_int64(s, h, o){
    return s.getBigInt64(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#get-big-uint64 99
   */
  
  force(function force_get_big_uint64(s, h, o){
    return s.getBigUint64(h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-int8 100
   */
  
  force(function force_set_int8(s, h, o, w){
    s.setInt8(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-uint8 101
   */
  
  force(function force_set_uint8(s, h, o, w){
    s.setUint8(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-int16 102
   */
  
  force(function force_set_int16(s, h, o, w){
    s.setInt16(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-uint16 103
   */
  
  force(function force_set_uint16(s, h, o, w){
    s.setUint16(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-int32 104
   */
  
  force(function force_set_int32(s, h, o, w){
    s.setInt32(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-uint32 105
   */
  
  force(function force_set_uint32(s, h, o, w){
    s.setUint32(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-float32 106
   */
  
  force(function force_set_float32(s, h, o, w){
    s.setFloat32(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-float64 107
   */
  
  force(function force_set_float64(s, h, o, w){
    s.setFloat64(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-big-int64 108
   */
  
  force(function force_set_big_int64(s, h, o, w){
    s.setBigInt64(h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/dataview#set-big-uint64 109
   */
  
  force(function force_set_big_uint64(s, h, o, w){
    s.setBigUint64(h, o, w)
  })  
  /**
   * @mount/drive/javascript/binding/console#assert 110
   */
  
  force(function force_assert(s, h, o, w){
    console.assert(s, h, o, w)
  })
  
  /**
   * @mount/drive/javascript/binding/console#clear 111
   */
  
  force(function force_clear(){
    console.clear()
  })
  
  /**
   * @mount/drive/javascript/binding/console#count 112
   */
  
  force(function force_count(s){
    console.count(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#count-reset 113
   */
  
  force(function force_count_reset(s){
    console.countReset(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#debug 114
   */
  
  force(function force_debug(s, h, o){
    console.debug(s, h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/console#dir 115
   */
  
  force(function force_dir(s){
    console.dir(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#dirxml 116
   */
  
  force(function force_dirxml(s){
    console.dirxml(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#error 117
   */
  
  force(function force_error(s, h, o){
    console.error(s, h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/console#group 118
   */
  
  force(function force_group(s){
    console.group(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#group-collapsed 119
   */
  
  force(function force_group_collapsed(s){
    console.groupCollapsed(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#group-end 120
   */
  
  force(function force_group_end(){
    console.groupEnd()
  })
  
  /**
   * @mount/drive/javascript/binding/console#info 121
   */
  
  force(function force_info(s, h, o){
    console.info(s, h, o)
  })
  
  /**
   * @mount/drive/javascript/binding/console#log 122
   */
  
  force(function force_log(s){
    console.log(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#table 123
   */
  
  force(function force_table(s, h){
    console.table(s, h)
  })
  
  /**
   * @mount/drive/javascript/binding/console#time 124
   */
  
  force(function force_time(s){
    console.time(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#time-end 125
   */
  
  force(function force_time_end(s){
    console.timeEnd(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#time-log 126
   */
  
  force(function force_time_log(s){
    console.timeLog(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#trace 127
   */
  
  force(function force_trace(s){
    console.trace(s)
  })
  
  /**
   * @mount/drive/javascript/binding/console#warn 128
   */
  
  force(function force_warn(s, h, o){
    console.warn(s, h, o)
  })  
  /**
   * @mount/drive/javascript/binding/datetime#create 129
   */
  
  force(function force_create(s){
    return new Date(s)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#parse 130
   */
  
  force(function force_parse(s){
    return Date.parse(s)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-millisecond-timestamp 131
   */
  
  force(function force_get_millisecond_timestamp(){
    return Date.now()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-microsecond-timestamp 132
   */
  
  force(function force_get_microsecond_timestamp(){
    return performance.now()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-date 133
   */
  
  force(function force_get_date(s){
    return s.getDate()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-day 134
   */
  
  force(function force_get_day(s){
    return s.getDay()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-full-year 135
   */
  
  force(function force_get_full_year(s){
    return s.getFullYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-hours 136
   */
  
  force(function force_get_hours(s){
    return s.getHours()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-milliseconds 137
   */
  
  force(function force_get_milliseconds(s){
    return s.getMilliseconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-minutes 138
   */
  
  force(function force_get_minutes(s){
    return s.getMinutes()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-month 139
   */
  
  force(function force_get_month(s){
    return s.getMonth()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-seconds 140
   */
  
  force(function force_get_seconds(s){
    return s.getSeconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-time 141
   */
  
  force(function force_get_time(s){
    return s.getTime()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-timezone-offset 142
   */
  
  force(function force_get_timezone_offset(s){
    return s.getTimezoneOffset()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-date 143
   */
  
  force(function force_get_utc_date(s){
    return s.getUTCDate()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-day 144
   */
  
  force(function force_get_utc_day(s){
    return s.getUTCDay()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-full-year 145
   */
  
  force(function force_get_utc_full_year(s){
    return s.getUTCFullYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-hours 146
   */
  
  force(function force_get_utc_hours(s){
    return s.getUTCHours()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-milliseconds 147
   */
  
  force(function force_get_utc_milliseconds(s){
    return s.getUTCMilliseconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-minutes 148
   */
  
  force(function force_get_utc_minutes(s){
    return s.getUTCMinutes()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-month 149
   */
  
  force(function force_get_utc_month(s){
    return s.getUTCMonth()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-seconds 150
   */
  
  force(function force_get_utc_seconds(s){
    return s.getUTCSeconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-year 151
   */
  
  force(function force_get_year(s){
    return s.getYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-date 152
   */
  
  force(function force_set_date(s, h){
    s.setDate(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-full-year 153
   */
  
  force(function force_set_full_year(s, h){
    s.setFullYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-hours 154
   */
  
  force(function force_set_hours(s, h){
    s.setHours(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-milliseconds 155
   */
  
  force(function force_set_milliseconds(s, h){
    s.setMilliseconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-minutes 156
   */
  
  force(function force_set_minutes(s, h){
    s.setMinutes(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-month 157
   */
  
  force(function force_set_month(s, h){
    s.setMonth(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-seconds 158
   */
  
  force(function force_set_seconds(s, h){
    s.setSeconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-time 159
   */
  
  force(function force_set_time(s, h){
    s.setTime(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-date 160
   */
  
  force(function force_set_utc_date(s, h){
    s.setUTCDate(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-full-year 161
   */
  
  force(function force_set_utc_full_year(s, h){
    s.setUTCFullYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-hours 162
   */
  
  force(function force_set_utc_hours(s, h){
    s.setUTCHours(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-milliseconds 163
   */
  
  force(function force_set_utc_milliseconds(s, h){
    s.setUTCMilliseconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-minutes 164
   */
  
  force(function force_set_utc_minutes(s, h){
    s.setUTCMinutes(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-month 165
   */
  
  force(function force_set_utc_month(s, h){
    s.setUTCMonth(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-seconds 166
   */
  
  force(function force_set_utc_seconds(s, h){
    s.setUTCSeconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-year 167
   */
  
  force(function force_set_year(s, h){
    s.setYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-date-string 168
   */
  
  force(function force_convert_to_date_string(s){
    return s.toDateString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-iso-string 169
   */
  
  force(function force_convert_to_iso_string(s){
    return s.toISOString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-json 170
   */
  
  force(function force_convert_to_json(s){
    return s.toJSON()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-gmt-string 171
   */
  
  force(function force_convert_to_gmt_string(s){
    return s.toGMTString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-date-string 172
   */
  
  force(function force_convert_to_locale_date_string(s){
    return s.toLocaleDateString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-format 173
   */
  
  force(function force_convert_to_locale_format(s){
    return s.toLocaleFormat()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-string 174
   */
  
  force(function force_convert_to_locale_string(s){
    return s.toLocaleString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-time-string 175
   */
  
  force(function force_convert_to_locale_time_string(s){
    return s.toLocaleTimeString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-string 176
   */
  
  force(function force_convert_to_string(s){
    return s.toString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-time-string 177
   */
  
  force(function force_convert_to_time_string(s){
    return s.toTimeString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-utc-string 178
   */
  
  force(function force_convert_to_utc_string(s){
    return s.toUTCString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-value-of 179
   */
  
  force(function force_get_value_of(s){
    return s.valueOf()
  })  
  /**
   * @mount/drive/javascript/binding/error#get-stack 180
   */
  
  force(function force_get_stack(s){
    return s.stack
  })
  
  /**
   * @mount/drive/javascript/binding/error#throw 181
   */
  
  force(function force_throw(s){
    throw s
  })  
  /**
   * @mount/drive/javascript/binding/interval#create 182
   */
  
  force(function force_create(s, h){
    return window.setInterval(h, s)
  })
  
  /**
   * @mount/drive/javascript/binding/interval#remove 183
   */
  
  force(function force_remove(s){
    window.clearInterval(s)
  })  
  /**
   * @mount/drive/javascript/binding/object#create 184
   */
  
  force(function force_create(){
    return {}
  })
  
  /**
   * @mount/drive/javascript/binding/object#check-if-has-property 185
   */
  
  force(function force_check_if_has_property(s, h){
    return s.hasOwnProperty(h)
  })
  
  /**
   * @mount/drive/javascript/binding/object#stringify-json 186
   */
  
  force(function force_stringify_json(s){
    return JSON.stringify(s)
  })
  
  /**
   * @mount/drive/javascript/binding/object#parse-json 187
   */
  
  force(function force_parse_json(s){
    return JSON.parse(s)
  })
  
  /**
   * @mount/drive/javascript/binding/object#get-keys 188
   */
  
  force(function force_get_keys(s){
    Object.keys(s)
  })
  
  /**
   * @mount/drive/javascript/binding/object#get-values 189
   */
  
  force(function force_get_values(s){
    Object.values(s)
  })  
  /**
   * @mount/drive/javascript/binding/regex#create 190
   */
  
  force(function force_create(s, h){
    return new RegExp(s, h)
  })
  
  /**
   * @mount/drive/javascript/binding/regex#test 191
   */
  
  force(function force_test(s, h){
    return s.test(h)
  })  
  /**
   * @mount/drive/javascript/binding/timeout#create 192
   */
  
  force(function force_create(s, h){
    return window.setTimeout(h, s)
  })
  
  /**
   * @mount/drive/javascript/binding/timeout#remove 193
   */
  
  force(function force_remove(s){
    window.clearTimeout(s)
  })  
  /**
   * @mount/drive/node/binding/fs#write-file 194
   */
  
  force(function force_write_file(s, h, o, w, l){
    s.writeFile(h, o, w, l)
  })
  
  /**
   * @mount/drive/node/binding/fs#read-file 195
   */
  
  force(function force_read_file(s, h, o, w){
    s.readFile(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#append-file 196
   */
  
  force(function force_append_file(s, h, o, w){
    s.appendFile(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#change-mode 197
   */
  
  force(function force_change_mode(s, h, o, w){
    s.chmod(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#change-owner 198
   */
  
  force(function force_change_owner(s, h, o, w, l){
    s.chown(h, o, w, l)
  })
  
  /**
   * @mount/drive/node/binding/fs#copy-file 199
   */
  
  force(function force_copy_file(s, h, o, w, l){
    s.copyFile(h, o, w, l)
  })
  
  /**
   * @mount/drive/node/binding/fs#create-read-stream 200
   */
  
  force(function force_create_read_stream(s, h, o){
    return s.createReadStream(h, o)
  })
  
  /**
   * @mount/drive/node/binding/fs#create-write-stream 201
   */
  
  force(function force_create_write_stream(s, h, o){
    return s.createWriteStream(h, o)
  })
  
  /**
   * @mount/drive/node/binding/fs#build-directory 202
   */
  
  force(function force_build_directory(s, h, o, w){
    s.mkdir(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#read-directory 203
   */
  
  force(function force_read_directory(s, h, o, w){
    s.readdir(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#rename 204
   */
  
  force(function force_rename(s, h, o, w){
    s.rename(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#clear-directory 205
   */
  
  force(function force_clear_directory(s, h, o, w){
    s.rmdir(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#stat 206
   */
  
  force(function force_stat(s, h, o, w){
    s.stat(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#truncate 207
   */
  
  force(function force_truncate(s, h, o, w){
    s.truncate(h, o, w)
  })
  
  /**
   * @mount/drive/node/binding/fs#unlink 208
   */
  
  force(function force_unlink(s, h, o){
    s.unlink(h, o)
  })  
  /**
   * @mount/drive/node/binding/assert#assert-equal 209
   */
  
  force(function force_assert_equal(s, h, o){
    s.equal(h, o)
  })  
  /**
   * @mount/drive/node/binding/child-process#spawn 210
   */
  
  force(function force_spawn(s, h, o){
    return s.spawn(h, o)
  })  
  /**
   * @mount/drive/node/binding/event#add-event-listener 211
   */
  
  force(function force_add_event_listener(s, h, o){
    s.on(h, o)
  })
  
  /**
   * @mount/drive/node/binding/event#remove-event-listener 212
   */
  
  force(function force_remove_event_listener(s, h, o){
    s.off(h, o)
  })  
  /**
   * @mount/drive/node/binding/http2#create-secure-server 213
   */
  
  force(function force_create_secure_server(s, h, o){
    s.createSecureServer(h, o)
  })  
  /**
   * @mount/drive/node/binding/module#require 214
   */
  
  force(function force_require(s){
    return require(s)
  })
  
  /**
   * @mount/drive/node/binding/module#get-current-directory-path 215
   */
  
  force(function force_get_current_directory_path(){
    return __dirname
  })
  
  /**
   * @mount/drive/node/binding/module#get-current-file-path 216
   */
  
  force(function force_get_current_file_path(){
    return __filename
  })  
  /**
   * @mount/drive/javascript/binding/datetime#create 217
   */
  
  force(function force_create(s){
    return new Date(s)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#parse 218
   */
  
  force(function force_parse(s){
    return Date.parse(s)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-millisecond-timestamp 219
   */
  
  force(function force_get_millisecond_timestamp(){
    return Date.now()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-microsecond-timestamp 220
   */
  
  force(function force_get_microsecond_timestamp(){
    return performance.now()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-date 221
   */
  
  force(function force_get_date(s){
    return s.getDate()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-day 222
   */
  
  force(function force_get_day(s){
    return s.getDay()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-full-year 223
   */
  
  force(function force_get_full_year(s){
    return s.getFullYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-hours 224
   */
  
  force(function force_get_hours(s){
    return s.getHours()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-milliseconds 225
   */
  
  force(function force_get_milliseconds(s){
    return s.getMilliseconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-minutes 226
   */
  
  force(function force_get_minutes(s){
    return s.getMinutes()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-month 227
   */
  
  force(function force_get_month(s){
    return s.getMonth()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-seconds 228
   */
  
  force(function force_get_seconds(s){
    return s.getSeconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-time 229
   */
  
  force(function force_get_time(s){
    return s.getTime()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-timezone-offset 230
   */
  
  force(function force_get_timezone_offset(s){
    return s.getTimezoneOffset()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-date 231
   */
  
  force(function force_get_utc_date(s){
    return s.getUTCDate()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-day 232
   */
  
  force(function force_get_utc_day(s){
    return s.getUTCDay()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-full-year 233
   */
  
  force(function force_get_utc_full_year(s){
    return s.getUTCFullYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-hours 234
   */
  
  force(function force_get_utc_hours(s){
    return s.getUTCHours()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-milliseconds 235
   */
  
  force(function force_get_utc_milliseconds(s){
    return s.getUTCMilliseconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-minutes 236
   */
  
  force(function force_get_utc_minutes(s){
    return s.getUTCMinutes()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-month 237
   */
  
  force(function force_get_utc_month(s){
    return s.getUTCMonth()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-utc-seconds 238
   */
  
  force(function force_get_utc_seconds(s){
    return s.getUTCSeconds()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-year 239
   */
  
  force(function force_get_year(s){
    return s.getYear()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-date 240
   */
  
  force(function force_set_date(s, h){
    s.setDate(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-full-year 241
   */
  
  force(function force_set_full_year(s, h){
    s.setFullYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-hours 242
   */
  
  force(function force_set_hours(s, h){
    s.setHours(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-milliseconds 243
   */
  
  force(function force_set_milliseconds(s, h){
    s.setMilliseconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-minutes 244
   */
  
  force(function force_set_minutes(s, h){
    s.setMinutes(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-month 245
   */
  
  force(function force_set_month(s, h){
    s.setMonth(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-seconds 246
   */
  
  force(function force_set_seconds(s, h){
    s.setSeconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-time 247
   */
  
  force(function force_set_time(s, h){
    s.setTime(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-date 248
   */
  
  force(function force_set_utc_date(s, h){
    s.setUTCDate(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-full-year 249
   */
  
  force(function force_set_utc_full_year(s, h){
    s.setUTCFullYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-hours 250
   */
  
  force(function force_set_utc_hours(s, h){
    s.setUTCHours(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-milliseconds 251
   */
  
  force(function force_set_utc_milliseconds(s, h){
    s.setUTCMilliseconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-minutes 252
   */
  
  force(function force_set_utc_minutes(s, h){
    s.setUTCMinutes(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-month 253
   */
  
  force(function force_set_utc_month(s, h){
    s.setUTCMonth(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-utc-seconds 254
   */
  
  force(function force_set_utc_seconds(s, h){
    s.setUTCSeconds(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#set-year 255
   */
  
  force(function force_set_year(s, h){
    s.setYear(h)
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-date-string 256
   */
  
  force(function force_convert_to_date_string(s){
    return s.toDateString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-iso-string 257
   */
  
  force(function force_convert_to_iso_string(s){
    return s.toISOString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-json 258
   */
  
  force(function force_convert_to_json(s){
    return s.toJSON()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-gmt-string 259
   */
  
  force(function force_convert_to_gmt_string(s){
    return s.toGMTString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-date-string 260
   */
  
  force(function force_convert_to_locale_date_string(s){
    return s.toLocaleDateString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-format 261
   */
  
  force(function force_convert_to_locale_format(s){
    return s.toLocaleFormat()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-string 262
   */
  
  force(function force_convert_to_locale_string(s){
    return s.toLocaleString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-locale-time-string 263
   */
  
  force(function force_convert_to_locale_time_string(s){
    return s.toLocaleTimeString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-string 264
   */
  
  force(function force_convert_to_string(s){
    return s.toString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-time-string 265
   */
  
  force(function force_convert_to_time_string(s){
    return s.toTimeString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#convert-to-utc-string 266
   */
  
  force(function force_convert_to_utc_string(s){
    return s.toUTCString()
  })
  
  /**
   * @mount/drive/javascript/binding/datetime#get-value-of 267
   */
  
  force(function force_get_value_of(s){
    return s.valueOf()
  })

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
