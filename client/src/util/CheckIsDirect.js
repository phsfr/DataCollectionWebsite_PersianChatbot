import axios from "axios";

// const isDirectQuestion = async (content)=>{
//     // const [is_direct, setDirect]=useState(false)
//     var is_direct = false
//     const response =  await request.post(
//       'http://localhost:5000',
//       { json: { 'utterance': content } },
//       function (error, response, body) {
//           if (!error && response.statusCode == 200) {
//             is_direct = body.direct
//             // setDirect(body.direct)
//             console.log('is_direct inside post: '+is_direct)
//             console.log(body)
//             //return is_direct
//           }
//       }
//     ); 
//     if(response)
//         return is_direct
// };
const isDirectQuestion = (content) =>{
	return new Promise((resolve, reject) => {
	  let payload = {utterance: content};
		axios.post('http://nlplab.sbu.ac.ir:55084/isdirect', payload).then(res => {
		    // console.log(`statusCode: ${res.status}`)
		    // console.log(res)
		    resolve(res.data.direct)
		  }).catch(error => {
		    reject(error)
	  })
	});
}
// async function checkUrl(content){
//         let payload = { utterance: content};
//         axios
//           .post('http://localhost:5000', payload, {
//             // todo: 'Buy the milk'
//           })
//           .then(res => {
//             console.log(`statusCode: ${res.status}`)
//             console.log(res)
//             return res.data.direct
//           })
//           .catch(error => {
//             console.error(error)
//           })
// }

// const isDirectQuestion = async(content) =>{checkUrl(content).then(res=>{ return res})}
// const isDirectQuestion = (content)=>{
// let payload = { utterance: content};
// const post_response = axios
//   .post('http://localhost:5000', payload, {
//     // todo: 'Buy the milk'
//   })
//   .then(res => {
//     console.log(`statusCode: ${res.status}`)
//     console.log(res)
//     return res.data.direct
//   })
//   .catch(error => {
//     console.error(error)
//   })
//   post_response.then(return )
// };

export default isDirectQuestion;