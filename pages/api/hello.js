// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  res.statusCode = 200
  
  res.json({ name: 'John Doe' })
}
