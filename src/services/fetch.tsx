import AsyncStorage from '@react-native-async-storage/async-storage';

import server from './server';


export async function FETCH(method: string, url: string, params: string | object /* | array*/, formData?: Object) {
  const errMsgLength = 100
  let auth_token = await AsyncStorage.getItem('token')
  if(!auth_token){
    console.log('LOG : TOKEN NOT FOUND')
  }
  console.log('LOG : Calling FETCH')

  let URL: string
  let baseUrl = server.server
  let finalParams = ''

  // Modifying Params 
  if (typeof (params) === 'string' && params !== '') {
    finalParams = '/'
    finalParams = finalParams + `${params}`
  } else {
    if (typeof (params) === 'object') {
      finalParams = '/?'
      let temp = ''
      Object.keys(params).forEach((ele, i) => {
        temp = `${ele}=${Object.values(params)[i]}`
        if (i !== Object.keys(params).length - 1) {
          temp = temp + `&`
        }
      })
      finalParams = finalParams + temp
    } else {
      // type your cases here if you want to send params by some other means like array 
    }
  }

  // CHecking whether full url has been passed 
  if (url.includes('http://') || url.includes('localhost:')) {
    URL = url + finalParams
  }
  else {
    URL = baseUrl + url + finalParams
  }

  console.log('LOG : Calling API: ' , URL)
  console.log('LOG : Body',JSON.stringify(formData))

  // Calling Api Using fetch 
  try {
    const res = await fetch(URL, {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth_token? `Bearer ${auth_token}`: ''
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json();

    console.log(`Data Recieved after calling API:${URL} is --->`)
    console.log(res.status,data)

    return {status : res.status ,data }

  } catch (error) {
    if (error) {
      console.log(`Error in calling API:${URL}--->`)
    }
    console.log(error)
  }
}


export async function MULTIPART_FETCH(method: string, url: string, params: string | object /* | array*/, formData?: Object) {
  const errMsgLength = 100
  let auth_token = await AsyncStorage.getItem('token')
  if(!auth_token){
    console.log('LOG : TOKEN NOT FOUND')
  }
  console.log('LOG : Calling FETCH')

  let URL: string
  let baseUrl = server.server
  let finalParams = ''

  // Modifying Params 
  if (typeof (params) === 'string' && params !== '') {
    finalParams = '/'
    finalParams = finalParams + `${params}`
  } else {
    if (typeof (params) === 'object') {
      finalParams = '/?'
      let temp = ''
      Object.keys(params).forEach((ele, i) => {
        temp = `${ele}=${Object.values(params)[i]}`
        if (i !== Object.keys(params).length - 1) {
          temp = temp + `&`
        }
      })
      finalParams = finalParams + temp
    } else {
      // type your cases here if you want to send params by some other means like array 
    }
  }

  // CHecking whether full url has been passed 
  if (url.includes('http://') || url.includes('localhost:')) {
    URL = url + finalParams
  }
  else {
    URL = baseUrl + url + finalParams
  }

  console.log('LOG : Calling API: ' , URL)
  console.log('LOG : Body',JSON.stringify(formData))

  // Calling Api Using fetch 
  try {
    const res = await fetch(URL, {
      method,
      mode: 'cors',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: auth_token? `Bearer ${auth_token}`: ''
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json();

    console.log(`Data Recieved after calling API:${URL} is --->`)
    console.log(res.status,data)

    return {status : res.status ,data }

  } catch (error) {
    if (error) {
      console.log(`Error in calling API:${URL}--->`)
    }
    console.log(error)
  }
}
