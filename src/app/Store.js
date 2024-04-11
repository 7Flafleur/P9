
const jsonOrThrowIfError = async (response) => {
  if(!response.ok) throw new Error((await response.json()).message) 
   // if status within 200-299, return response body as JSON
  return response.json()
}

class Api {                 //defines methods for making http requests
  constructor({baseUrl}) {
    this.baseUrl = baseUrl;
  }
  async get({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'GET'}))
  }
  async post({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'POST', body: data}))   // expects body to be JSON
  }
  async delete({url, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'DELETE'}))
  }
  async patch({url, data, headers}) {
    return jsonOrThrowIfError(await fetch(`${this.baseUrl}${url}`, {headers, method: 'PATCH', body: data}))
  }
}

const getHeaders = (headers) => {   //generates http headers
  const h = { }      //empty object
  if (!headers.noContentType) h['Content-Type'] = 'application/json'  // add content type value if undefinde, null, NaN, 0 or false
  const jwt = localStorage.getItem('jwt')  //retrieve token for identification
  if (jwt && !headers.noAuthorization) h['Authorization'] = `Bearer ${jwt}` //if jwt exists and noauthorization property is nut true, set Authorization property to h with value bearer jwt
  //return object with combined properties of h and header
  return {...h, ...headers}
}

class ApiEntity {                                               
  constructor({key, api}) {
    this.key = key;
    this.api = api;
  }
  //async means function, means method, CRUD, 

  async select({selector, headers = {}}) {               //retrieves a specific entity (like a user or a bill) from the API, based on the selector provided
    return await (this.api.get({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
  //function that retrieves bills
  async list({headers = {}} = {}) {           //retrieves all entities of a certain type (like all users or all bills) from the API.
    return await (this.api.get({url: `/${this.key}`, headers: getHeaders(headers)}))
  }
  async update({data, selector, headers = {}}) {  //updates a specific entity on the API, based on the selector provided.
    return await (this.api.patch({url: `/${this.key}/${selector}`, headers: getHeaders(headers), data}))
  }
  async create({data, headers = {}}) {   // creates a new entity on the API
    return await (this.api.post({url: `/${this.key}`, headers: getHeaders(headers), data}))
  }
  async delete({selector, headers = {}}) {   //deletes a specific entity from the API, based on the selector provided.
    return await (this.api.delete({url: `/${this.key}/${selector}`, headers: getHeaders(headers)}))
  }
}



class Store {
  constructor() {
    this.api = new Api({baseUrl: 'http://localhost:5678'})
  }

  user = uid => (new ApiEntity({key: 'users', api: this.api})).select({selector: uid})      //Returns a specific user from the API
  users = () => new ApiEntity({key: 'users', api: this.api})   //users(): Returns all users from the API.
  login = (data) => this.api.post({url: '/auth/login', data, headers: getHeaders({noAuthorization: true})}) //login(data): Sends a login request to the API.

  ref = (path) => this.store.doc(path) // ?

  bill = bid => (new ApiEntity({key: 'bills', api: this.api})).select({selector: bid})  //bill(bid): Returns a specific bill from the API.
  bills = () => new ApiEntity({key: 'bills', api: this.api}) //bills(): Returns all bills from the API.
}

export default new Store()   //Object, not classs!! no instatiation possible
