import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
const UserAuthComponent = () => {
  const navigate = useNavigate();
  const[load,ssetLoad] = useState(false)
  const [register, setRegister]=useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [userdata, setUserdata] = useState([]);
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  React.useEffect(() => {
    fetchUser();
  }, [group]);

  const reset = () => {
    setName('');
    setPassword('');
    setGroup('');
    setUser('');
    setUsername('');
  };
  const fetchUser = async () => {
    await getDocs(collection(db, 'users')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => doc.data().users);
      setUserdata(newData.filter((res) => res.group_name === group));
      console.log('G', userdata);
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoad(true)
    await createUserWithEmailAndPassword(auth, name, password)
      .then(async (userCredential) => {
        setLoad(false)
        const users = userCredential.user;
        console.log(users);
        try {
          const docRef = await addDoc(collection(db, 'users'), {
            users: {
              uid: users.uid,
              username: username,
              group_name: group,
              user_type: user,
              is_admin: userdata.length ? false : true,
            },
          });
          console.log(docRef)
        } catch (e) {
          alert('Error adding document: ', e);
        }
        reset();
        setRegister(!register);
      })
      .catch((error) => {
        setLoad(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
  };
  const onLogin = (e) => {
    setLoad(true)
    e.preventDefault();
    signInWithEmailAndPassword(auth, name, password)
      .then((userCredential) => {
        setLoad(false)
        const users = userCredential.user;
        reset();
        navigate('/dashboard');
      })
      .catch((error) => {
        setLoad(false)
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorCode, errorMessage);
      });
  };

  return (
    <div>
      <Card style={{ width: '18rem',margin:'auto'}}>
        <Card.Body>
          <Card.Title>{register ? 'Sign Up' : 'Sign In'}</Card.Title>
          <Card.Text>
            {register ? (
              <>
                <Form onSubmit={onSubmit}>
                  <Form.Group className="mb-3" required>
                    <Form.Control
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      aria-label="username"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" required>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Email"
                      aria-label="Email"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      value={group}
                      onChange={(e) => {
                        setGroup(e.target.value);
                      }}
                      placeholder="Group Name"
                      aria-label="group name"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Select
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      aria-label="User Types"
                      required
                    >
                      <option>User Types</option>
                      <option value="Admin">Admin</option>
                      <option value="Contributor">Contributor</option>
                      <option value="Service Provider">Service Provider</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder="password"
                      aria-label="password"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                 {load ? 'loading':'Submit'}
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Form onSubmit={onLogin}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="usermail"
                      aria-label="usermail"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      passwordel="password"
                      aria-describedby="basic-addon2"
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                   {load ? 'loading':'Submit'}                
                  </Button>
                </Form>
              </>
            )}
          </Card.Text>
          <Card.Link
            href="#"
            onClick={() => {
              setRegister(!register);
            }}
          >
            {register ? 'Sign In' : 'Create New Account?'}
          </Card.Link>
        </Card.Body>
      </Card>
    </div>
  );
};
export default UserAuthComponent;
