import "./loginpage.css"
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Loginpage(){
    const navigate=useNavigate()
    const [showLoginForm, setShowLoginForm] = useState(true)
    const toggleForm=()=>{
        setShowLoginForm(!showLoginForm)
    };

    const [name, setname] = useState('')
    const [username, setusername] = useState('')
    const [password, setpassword] = useState('')

    const [loginusername, setloginusername] = useState('')
    const [loginpassword, setloginpassword] = useState('')

    const [sessionalive, setsessionalive] = useState('');

    const handleAdduser=(e)=>{
        e.preventDefault(); 
      
        const newUser={
            name: name,
            username: username,
            password: password,
        }        
        fetch('http://localhost:3001/adduser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(newUser)
        })
        .then(response =>{
            response.json()
        })
        .catch(error => {
            console.error('Error:', error)
        })
        alert(`Welcome ${name}, Now you can login with your credentials `)
        toggleForm()
    }


    const handlelogin=(e)=>{
        e.preventDefault();
        const userlogins={
            username: loginusername,
            password: loginpassword
        }
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userlogins)
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            } 
            else {
                alert('Login failed')
            }
        })
        .then(data => {
            if (data!=null) {
                alert(`Welcome ${data.name}`);
                navigate(`/user/${data._id}`);
            } 
            else {
                alert('Invalid Credentials, please create an account if not already.');
                navigate('/')
            }
        })
        .catch(error=>{
            console.log(error);
        });

    }
    // if(window.location.reload()){
    //     if(sessionalive==undefined){
    //         navigate('/')
    //     }
    // }

    return(
        <>
            <div className="circle"></div>
            <div className="heading">
                <h1>Enhance your language skills</h1>
            </div>
            {showLoginForm ? (
                <div className="myform1" >
                    <form onSubmit={handlelogin} action="">
                        <h2>Login</h2>
                        <input required type="text" placeholder="Your username" onChange={(e) => setloginusername(e.target.value)} /><br/>
                        <input required type="password" placeholder="password" onChange={(e) => setloginpassword(e.target.value)} /><br />
                        <input className="button1" type="submit"/><br />
                    </form>
                    Don't have an Account? Create One <a href="#" onClick={(e)=>{e.preventDefault(); toggleForm()}}>Here</a>.
                </div>
                
            ) : (
                <div className="myform2" >
                    <form onSubmit={handleAdduser} action="">
                        <h2>Creating Account</h2>
                        <input required type="text" placeholder="Your Name" onChange={(e) => setname(e.target.value)} /><br/>
                        <input required type="text" placeholder="Your username" onChange={(e) => setusername(e.target.value)} /><br/>
                        <input required type="password" placeholder="password" onChange={(e) => setpassword(e.target.value)} /><br />
                        <input className="button2" type="submit" value="CREATE" /><br />
                    </form>
                    Back to <a href="" onClick={(e)=>{e.preventDefault(); toggleForm()}}>Login</a>.
                </div>
            )}
        </>  
    );
}

export default Loginpage