import React from 'react'

const EmojiContainer = (props) => {
  // https://getemoji.com/

  // win7 기준으로 수정
  const emojiSmileys = '😁,😂,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,😚,☺️,😐,😶,😏,😣,😥,😪,😫,😌,😜,😝,😒,😓,😔,😲,☹️,😖,😞,😤,😢,😭,😨,😩,😰,😱,😳,😵,😡,😠,😷,😇,😈,👿,👹,👺,💀,👻,👽,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾'
  const emojiGestures = '👋,✋,👌,✌,👈,👉,👆,👇,👍,👎,✊,👊,👏,🙌,👐,🙏,✍️,💅,💪,👂,👃,👀,👅,👄,💋'
  // const emojiSmileys = '😀,😁,😂,🤣,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,🥰,😗,😙,😚,☺️,🙂,🤗,🤩,🤔,🤨,😐,😑,😶,🙄,😏,😣,😥,😮,🤐,😯,😪,😫,😴,😌,😛,😜,😝,🤤,😒,😓,😔,😕,🙃,🤑,😲,☹️,🙁,😖,😞,😟,😤,😢,😭,😦,😧,😨,😩,🤯,😬,😰,😱,🥵,🥶,😳,🤪,😵,😡,😠,🤬,😷,🤒,🤕,🤢,🤮,🤧,😇,🤠,🤡,🥳,🥴,🥺,🤥,🤫,🤭,🧐,🤓,😈,👿,👹,👺,💀,👻,👽,🤖,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾'
  // const emojiGestures = '👋,🤚,🖐,✋,🖖,👌,✌,🤞,🤟,🤘,🤙,👈,👉,👆,🖕,👇,👍,👎,✊,👊,🤛,🤜,👏,🙌,👐,🤲,🤝,🙏,✍️,💅,🤳,💪,🦵,🦶,👂,👃,🧠,🦷,🦴,👀,👁,👅,👄,💋'

  return (
    <div className={(props.getState === true) ? 'emoji-container active' : 'emoji-container'}>
      {/* <div className="emoji-title">Smileys</div> */}
      { emojiSmileys && emojiSmileys.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            props.selectEmoji({ emoji: e.currentTarget.textContent })
            props.setState(false)
          }}>
          {m}
        </div>
      )) }
      {/* <div className="emoji-title">Gestures and Body Parts</div> */}
      { emojiGestures && emojiGestures.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            props.selectEmoji({ emoji: e.currentTarget.textContent })
            props.setState(false)
          }}>
          {m}
        </div>
      )) }
    </div>
  )
}

  // <p>😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🤡🥳🥴🥺🤥🤫🤭🧐🤓😈👿👹👺💀👻👽🤖💩😺😸😹😻😼😽🙀😿😾</p>

export default React.memo(EmojiContainer)
