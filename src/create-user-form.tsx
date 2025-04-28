import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiZmlyZGF2cy5qMjAwNkBnbWFpbC5jb20iXSwiaXNzIjoiaGVubmdlLWFkbWlzc2lvbi1jaGFsbGVuZ2UiLCJzdWIiOiJjaGFsbGVuZ2UifQ.V5ZGu-lVk19DAP4KSfhu2lLvWXuRtiYz2IUMFvai4WM"
const errorTextList = {
  pwdLeastLen: "Password must be at least 10 characters long",
  pwdMostLen: "Password must be at most 24 characters long",
  pwdNoSpaces: "Password cannot contain spaces",
  pwdOneNum: "Password must contain at least one number",
  pwdUpper: "Password must contain at least one uppercase letter",
  pwdLower: "Password must contain at least one lowercase letter",
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [formData, setFormData] = useState({username: '', password: ''})
  const [pwdList, setPwdList] = useState<string[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [responseError, setResponseError] = useState("");
  
  const handleChange = (e: any) => {
    const inputVal = e.target.value
    const errors: string[] = []
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    console.log(e.target.name);
  
    if (e.target.name == "password") {
  
      if((inputVal.length < 10)) {
        errors.push(errorTextList.pwdLeastLen)
      }
      if((inputVal.length > 24)) {
        errors.push(errorTextList.pwdMostLen)
      }
      if (inputVal.includes(" ")) {
        errors.push(errorTextList.pwdNoSpaces)
      }
      if (inputVal.search(/[0-9]/) < 0) {
        errors.push(errorTextList.pwdOneNum)
      }
      if (inputVal.search(/[a-z]/i) < 0) {
        errors.push(errorTextList.pwdLower)
      }
      if (inputVal.search(/[A-Z]/i) < 0) {
        errors.push(errorTextList.pwdUpper)
      }
      
      setPwdList(errors)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setResponseError("")

    if (formData.username.length > 0 && pwdList.length == 0) {
      try {

        const response = await fetch('https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })

        setFormSubmitted(true);

        if (response.ok) {
          const data = response.json()
          console.log("Success:", data);
          setUserWasCreated(true);
        } else {
          switch (response.status) {
            case 422: 
              setResponseError("Sorry, the entered password is not allowed, please try a different one.");
              break;
            case 500:
              setResponseError("Something went wrong, please try again.");
              break;
            case 401:
              setResponseError("Not authenticated to access this resource.");
              break;
            case 403:
              setResponseError("Not authenticated to access this resource.");
          }
          if (response.status == 422) {
            setResponseError("Sorry, the entered password is not allowed, please try a different one.");
          }
        }
      } catch (error) {
        console.log(error);
      }

    } else {
      console.log("Enter a username and password in correct format");
    }
  }

  return (
    
    <div style={formWrapper}>
      <form style={form} action={"/challenge-signup"}>

        {formSubmitted && responseError.length > 0 && (
          <div style={apiError}>
            {responseError}
          </div>
        )}
        <label style={formLabel} htmlFor="username">Username</label>
        <input
         id='username'
         style={formInput}
         value={formData.username}
         name="username"
         onChange={handleChange}
        />

        <label style={formLabel} htmlFor="password">Password</label>
        <input
         id='password'
         style={formInput}
         value={formData.password}
         name="password"
         type="password"
         onChange={handleChange}
        />
        {pwdList.length > 0 && (
          <ul>
            {pwdList.map((item, index) => (
              <li key={index}>
                {item}
              </li>
            ))}
          </ul>
        )}
        <button style={formButton} onClick={(e) => handleSubmit(e)} type="submit">Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };

const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};


// My added styles

const apiError: CSSProperties = {
  backgroundColor: '#ff4747',
  color: '#ffffff',
  padding: '5px 13px',
  borderRadius: '5px',
  fontWeight: 'regular'
}