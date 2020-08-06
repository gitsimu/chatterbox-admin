import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import FirebaseConfig from '../firebase.config'

const Manager = ({ settings, ...props }) => {
  const [managers, setManagers] = React.useState([])
  const _managers = [
    ,'agvukwxj1'
    ,'ap0gdti7q'
    ,'awtkze0h1'
    ,'b9r4a3xca'
    ,'bfe9ui8v7'
    ,'br92yqidd'
    ,'bx91qqei8'
    ,'c6tg38hfa'
    ,'c8nzzlrh8'
    ,'cogdq4zom'
    ,'cpaj3uhtw'
    ,'d1z7ci8oy'
    ,'dddgs8t2b'
    ,'dxu34jg6c'
    ,'e0m6uiv56'
    ,'e6bt2mbqz'
    ,'e8colctix'
    ,'eht3f9ssn'
    ,'eybecmko0'
    ,'ez8hwe6jm'
    ,'fgejisf8n'
    ,'fu70ttvbh'
    ,'fyfz0bk0h'
    ,'g8kz2sqzz'
    ,'g916f2myr'
    ,'glzbn14jn'
    ,'gzdw56ake'
    ,'han6ckiz6'
    ,'ikuppea9g'
    ,'in85eg7s4'
    ,'iq3hij1n3'
    ,'isjb9ek4d'
    ,'j6yssj53v'
    ,'jffh6w2f7'
    ,'l2pyexzxl'
    ,'lfo3awmio'
    ,'lkdr50k4o'
    ,'lkuakymd4'
    ,'lyjd7mmwu'
    ,'lym3oh3tl'
    ,'lyw92yi47'
    ,'n34hk1p6p'
    ,'n3afaf9fj'
    ,'nog0ij49q'
    ,'o96vyivkb'
    ,'oca92khig'
    ,'oyye42caj'
    ,'ozckzl9jd'
    ,'pm0ychqn7'
    ,'pnenixjny'
    ,'qkk768iq5'
    ,'r4mq03n5z'
    ,'rb1z2sddh'
    ,'rch66l8o4'
    ,'rev8aic0x'
    ,'rndsmlch1'
    ,'rrf1gp4h1'
    ,'sjt9p4b76'
    ,'sp1yv5lcg'
    ,'t36j9qwtf'
    ,'tm6ofojtm'
    ,'uu9wp1bmu'
    ,'vb0kpl5gv'
    ,'vn9bqyp4q'
    ,'x9egvwjd5'
    ,'xjy7qurp5'
    ,'xpor2pkjh'
    ,'xvxdjmpen'
    ,'xwhniu9mf'
    ,'xyq901tvq'
    ,'y3bqlj4ry'
    ,'yjo29l81z'
    ,'yqwhztdog'
    ,'yr2z3hw0b'
    ,'zdxudbsdp'
    ,'zkwthdba6'
    ,'zq7d4h5kf'
    ,'zzdgfqcx2']

  React.useEffect(() => {
    const fetchData = async () => {
      for (const m of _managers) {
        await axios.get(`${FirebaseConfig.databaseURL}/${m}/messages.json?shallow=true&print=pretty'`)
          .then(({data}) => {
            if (data) {
              setManagerData({id: m, messages: data})
            }
            console.log('success', data)
          })
          .catch((err) => {
            console.log('err', err)
          })
      }
    }
    fetchData()
  }, [])

  const setManagerData = (newData) => {
    setManagers(m => [...m, newData])
  }

  return (
    <div>
      {managers && managers.map((m, i) => {
        return (
          <div className="managers" key={i}>
            <div className="managers-id">{m.id}</div>
            <div className="managers-message-count">{Object.keys(m.messages).length}</div>
          </div>
        )
      })}
    </div>
  )
}

const mapStateToProps = state => ({
  settings: state.settings
})

// export default ChatMessage
export default connect(mapStateToProps)(Manager)
