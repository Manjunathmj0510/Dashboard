import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { BsBalloonHeartFill } from 'react-icons/bs';
const Dashboard = ({ uid }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState('');
  const [postData, setPostData] = useState([]);
  const [group, setGroup] = useState('');
  const [user, setUser] = useState({});
  const [care, setCare] = useState(false);
  const [iddata, setIddata] = useState([]);
  const [count, setCount] = useState(0);
  React.useEffect(() => {
    fetchUser();
    fetchPost();
  }, [JSON.stringify(user)]);

  const postDoc = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        posts: {
          posts: post,
          group: group,
          iscaredof: care,
          marked: false,
          username: user[0]?.username,
          usertype: user[0]?.user_type,
        },
      });
      console.log(docRef)
    } catch (e) {
      alert(e);
    }
  };
  const handleUpdate = (e, id, d) => {
    e.preventDefault();
    const collref = doc(db, 'posts', id);
    updateDoc(collref, {
      'posts.marked': d,
    })
      .then((response) => {
        alert('updated');
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  const fetchPost = async () => {
    await getDocs(collection(db, 'posts')).then((res) => {
      const newData = res?.docs.map((res) => res.data().posts);
      setIddata(res?.docs.map((res) => res.id));
      setCount(newData.length);
      setPostData(
        newData?.filter(
          (res) =>
            res?.usertype !==
            (user[0]?.user_type === 'Service Provider'
              ? 'Contributor'
              : user[0]?.user_type === 'Contributor'
              ? 'Service Provider'
              : '')
        )
      );
    });
  };
  const fetchUser = async () => {
    await getDocs(collection(db, 'users')).then((querySnapshot) => {
      const newData = querySnapshot.docs.map((doc) => doc.data().users);
      setUser(newData.filter((res) => res.uid === uid));
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
        console.log('Signed out successfully');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <div>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#">{user[0]?.username}</Nav.Link>
            <Nav.Link href="#" onClick={handleLogout}>
              Log Out
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <br />
        <Card style={{ width: '18rem', margin: '1%',backgroundColor:'#555' }}>
          <Card.body>
            <Card.text>
              {count}
              Total Posts
            </Card.text>
          </Card.body>
        </Card>
        <Card style={{ width: '18rem', margin: '1%',backgroundColor:'#555'}}>
          <Card.body>
            <Card.text>
              {postData?.length}
              current posts
            </Card.text>
          </Card.body>
        </Card>

        {user[0]?.user_type === 'Service Provider' ? (
          ''
        ) : (
          <Form onSubmit={postDoc}>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                rows={3}
                value={post}
                placeholder="Post here..."
                onChange={(e) => setPost(e.target.value)}
                required
              />
            </Form.Group>
            {user[0]?.user_type === 'Contributor' ? (
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Control
                  rows={3}
                  value={group}
                  placeholder="who can see your post"
                  onChange={(e) => setGroup(e.target.value)}
                  required
                />
              </Form.Group>
            ) : (
              ''
            )}
            {user[0]?.user_type === 'Admin' ? (
              <Form.Check
                type="switch"
                id="custom-switch"
                label="Is cared of"
                onChange={(e) => setCare(!care)}
              />
            ) : (
              ''
            )}
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        )}
        <br />
        {postData?.map((res, index) => (
          <Card style={{ width: '18rem', margin: '1%' }}>
            <Card.Body>
              <Card.Text>{res?.posts}</Card.Text>
              {res?.iscaredof ? (
                <Card.Link
                  href="#"
                  style={{ color: res.marked ? 'red' : 'green' }}
                  tooltip="cared of"
                  onClick={(e) =>
                    handleUpdate(e, iddata[index], res.marked ? false : true)
                  }
                >
                  <BsBalloonHeartFill/>
                </Card.Link>
              ) : (
                ''
              )}
              <Card.Link href="#" style={{ textDecoration: 'none' }}>
                By {res.username}
              </Card.Link>
            </Card.Body>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default Dashboard;
