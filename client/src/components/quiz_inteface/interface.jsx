import "./interface.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



function Interface(){
    const navigate=useNavigate()
    const [allquestions, setallquestions]=useState([])
    const [currentquestion, setcurrentquestion]=useState({})
    const [showquiz, setshowquiz] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [maxQuestions, setMaxQuestions] = useState(1)
    const [allusers, setallusers] = useState([])
    const [userId, setuserId] = useState('');
    const [userScore, setuserScore] = useState(0);

    useEffect(() => {
        const urlParts = window.location.pathname.split('/');
        const idFromUrl = urlParts[urlParts.length - 1];
        setuserId(idFromUrl);

        fetch(`http://localhost:3001/getuserscore/${userId}`)
        .then((response)=>{
            return response.json()
        })
        .then((data)=>{
            setuserScore(data.score)
        })
        .catch(err=>{
            console.log(err);
        })
    }, [])

    

    useEffect(()=>{
        fetch('http://localhost:3001/getallquestion',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data=>{
            setallquestions(data)
        })
        .catch(err => {
            console.log(err)
        })
    },[])

    const handlestartquiz=()=>{
        const questionsM2 = allquestions.filter(question => question.marks === 2);
        const randomIndex = (Math.random() * questionsM2.length) | 0;
        const randomQue = questionsM2[randomIndex];
        setcurrentquestion(randomQue)
        setshowquiz(true)
    }
      
    const handleOptionChange=(e)=>{
        const labelValue = e.target.nextSibling.textContent;
  
        if (selectedAnswer === labelValue) {
            setSelectedAnswer(null);
        } else {
            setSelectedAnswer(labelValue);
        }

        
    }
    const handleNextQuestions=()=>{
        setSelectedAnswer(null);
        setMaxQuestions(maxQuestions+1)
        const isCorrect=selectedAnswer===currentquestion.ans;
        if(maxQuestions<20){
            if(isCorrect){
                // alert('Correct answer!')
                const questionsM5=allquestions.filter(question=>question.marks===5)
                const randomIndex=(Math.random()*questionsM5.length)|0
                const randomQue=questionsM5[randomIndex]
                if(currentquestion.marks===2){
                    const newScore=userScore+currentquestion.marks
                    setuserScore(newScore)
                    setcurrentquestion(randomQue)
                }
                else if(currentquestion.marks===5){
                    const newScore=userScore+currentquestion.marks
                    setuserScore(newScore)
                    setcurrentquestion(randomQue)
                }
                else{
                    const newScore=userScore+currentquestion.marks
                    setuserScore(newScore)
                    const questionsM2=allquestions.filter(question=>question.marks===2)
                    const randomIndex=(Math.random()*questionsM2.length)|0
                    const randomQue=questionsM2[randomIndex]
                    setcurrentquestion(randomQue)
                }  
            }
            else{
                // alert('Wrong answer!');
                if(currentquestion.marks===5){
                    const questionsM2=allquestions.filter(question=>question.marks===2)
                    const randomIndex=(Math.random()*questionsM2.length)|0
                    const randomQue=questionsM2[randomIndex]
                    setcurrentquestion(randomQue)
                }
                else if(currentquestion.marks===2){
                    const questionsM1=allquestions.filter(question=>question.marks===1)
                    const randomIndex=(Math.random()*questionsM1.length)|0
                    const randomQue=questionsM1[randomIndex]
                    setcurrentquestion(randomQue)
                }
                else{
                    const questionsM1=allquestions.filter(question=>question.marks===1)
                    const randomIndex=(Math.random()*questionsM1.length)|0
                    const randomQue=questionsM1[randomIndex]
                    setcurrentquestion(randomQue)
                }
            }
        }
        else{
            alert("Well Done!!!, Now you can see your Score in LeaderBoard.")
            window.location.reload()
            fetch(`http://localhost:3001/updatescore`,{
                method:'POST',
                headers:{
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({_id:userId, score:userScore})
            })
            .then(response => {
                if (response.ok) {
                  console.log('User score updated successfully')
                }
                else{
                    console.log('Failed to update user score')
                }
            })
            .catch(err=>{
                console.log(err);
            })
        } 
    }

    useEffect(()=>{
        fetch('http://localhost:3001/getallusers',{
            method:'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((response)=>{
            return  response.json()
        })
        .then((userdata)=>{
            setallusers(userdata)
        })
        .catch((error)=>{
            console.log(error);
        })
    },[])
    const sortedUsers=[...allusers].sort((a, b)=>b.score-a.score);

    const handleNewQueSubmit=async(e)=>{
        e.preventDefault();
      
        const formData=new FormData(e.target);
        console.log(formData);
      
        const questionData={
          question: formData.get('question'),
          options: [
            formData.get('option1'),
            formData.get('option2'),
            formData.get('option3'),
            formData.get('option4'),
          ],
          marks: formData.get('marks'),
          correctAnswer: formData.get('correctAnswer'),
        };
      
        fetch('http://localhost:3001/addnewquestion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(questionData),
        })
        alert("New Question added to the Quiz")
        e.target.reset()
    }
    
    const handleLogout=()=>{
        navigate('/')
    }

    return(
        <>
            <div className="header">
                <h1>Welcome user, Take this quiz to improve your lanugage</h1>
                <button onClick={handleLogout}>LOGOUT</button>
            </div>
            <div className="midsection">
                <div className="left">
                    <div className="quiz_section">
                        {!showquiz && (
                            <div className="intructions">
                            <div>INSTRUCTION</div>
                            <hr />
                            <div>
                                1. There will be 20 MCQ questions to improve your language.<br/>
                                2. You will be given questions randomly of marks-1/2/5.<br/>
                                <span style={{color:'red'}}>*Note : Questions are not repeated.</span><br/>
                                3. Skipping an answer and going to previous question are not allowed.<br/>
                                4. There will be 3 level of questions, your level of next question will be based on your previous answer.<br/>
                                (For example: if you give right answer to 1st question and your 2nd question will be of advance level, else you will get a easier one.)<br/>
                                5. You can see your score and position in leaderboard.<br/>
                                6. <label htmlFor="lang">Choose your lanuage : </label>
                                <select name="lang" id="lang">
                                    <option value="english">English</option>
                                </select><br/><br/>
                                <b>Click on the button below to start the test</b><br/>
                                <button onClick={handlestartquiz} style={{background:'rgba(0, 0, 255, 0.592)', color:'white'}}>START QUIZ</button>
                            </div>
                        </div>
                        )}
                        {showquiz && (
                            <div>
                                <div className="qheader">Que {maxQuestions}- {currentquestion.que} ({currentquestion.marks} marks)</div>
                                <div className="qselections">
                                {['opt1', 'opt2', 'opt3', 'opt4'].map((option, index) => (
                                    <div className="form-check" key={index}>
                                    <input
                                        onChange={handleOptionChange}
                                        className="form-check-input"
                                        id={`opt${index + 1}`}
                                        type="radio"
                                        name="options"
                                        checked={selectedAnswer === currentquestion[option]}
                                        value={option}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`opt${index + 1}`}
                                    >
                                        {currentquestion[option]}
                                    </label>
                                    </div>
                                ))}
                                </div>
                                <hr />
                                <button onClick={handleNextQuestions}>NEXT</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="right">
                    <div className="leaderboard">
                        <div>Leaderboard</div>
                        {sortedUsers.map((user, index) => (
                            <div key={index}>
                                <span><b>{user.name}</b> score is <b>{user.score}</b></span>
                                <hr />
                            </div>
                        ))}
                        
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="footer_heading"><h2>You can also add your new questions to the Quiz, but they should be valid.</h2></div>
                <div className="footer_form">
                    <form onSubmit={handleNewQueSubmit}>
                        <div>
                            <input required type="text" name="question" placeholder="Your Question..." /><br />
                            <input required type="text" name="option1" placeholder="Option 1" /><br />
                            <input required type="text" name="option2" placeholder="Option 2" /><br />
                            <input required type="text" name="option3" placeholder="Option 3" /><br />
                            <input required type="text" name="option4" placeholder="Option 4" />
                        </div>
                        <div>
                            <label htmlFor="marks">Marks: </label>
                            <select required name="marks" id="marks">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="5">5</option>
                            </select><br />
                            <input required type="text" name="correctAnswer" placeholder="Correct answer" /><br />
                            <button type="submit">Add Question</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Interface