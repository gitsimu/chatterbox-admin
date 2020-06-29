import React from 'react'

const EmojiConatiner = (props) => {
  // https://getemoji.com/
  const emoji = '😀,😁,😂,🤣,😃,😄,😅,😆,😉,😊,😋,😎,😍,😘,🥰,😗,😙,😚,☺️,🙂,🤗,🤩,🤔,🤨,😐,😑,😶,🙄,😏,😣,😥,😮,🤐,😯,😪,😫,😴,😌,😛,😜,😝,🤤,😒,😓,😔,😕,🙃,🤑,😲,☹️,🙁,😖,😞,😟,😤,😢,😭,😦,😧,😨,😩,🤯,😬,😰,😱,🥵,🥶,😳,🤪,😵,😡,😠,🤬,😷,🤒,🤕,🤢,🤮,🤧,😇,🤠,🤡,🥳,🥴,🥺,🤥,🤫,🤭,🧐,🤓,😈,👿,👹,👺,💀,👻,👽,🤖,💩,😺,😸,😹,😻,😼,😽,🙀,😿,😾'

  React.useEffect(() => {

  },[])

  return (
    <div className={(props.getState === true) ? 'emoji-container active' : 'emoji-container'}>
      { emoji && emoji.split(',').map((m, i) => (
        <div
          key={i}
          className="emoji"
          onClick={(e) => {
            props.selectEmoji({ emoji: e.currentTarget.textContent, timestamp: new Date().getTime() })
            props.setState(false)
          }}>
          {m}
        </div>
      )) }
    </div>
  )
}

  // <p>😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚☺️🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵😡😠🤬😷🤒🤕🤢🤮🤧😇🤠🤡🥳🥴🥺🤥🤫🤭🧐🤓😈👿👹👺💀👻👽🤖💩😺😸😹😻😼😽🙀😿😾</p>

export default EmojiConatiner
