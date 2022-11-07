// import './App.css';

import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';
import Spinner from 'react-bootstrap/Spinner';




function App() {

	const [APIData, setAPIData] = useState([])
	const [films, setFilms] = useState({});
	const [filmDetails,setFilmDetails] = useState({});
  const [isLoading, setLoading] = useState(true)


	//fetch api function
	const fetchData = () => {
    return fetch("https://swapi.dev/api/films/?format=json")
          .then((response) => response.json())
          .then((data) => {setAPIData(data.results); setFilms(data.results); setLoading(false)});
  }

  useEffect(() => {
		fetchData();
  },[]);



  // code to convert number to roman number
	function integer_to_roman(num) {
		if (typeof num !== 'number') 
		return false; 
		
		var digits = String(+num).split(""),
		key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
		"","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
		"","I","II","III","IV","V","VI","VII","VIII","IX"],
		roman_num = "",
		i = 3;
		while (i--)
		roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
		return Array(+digits.join("") + 1).join("M") + roman_num;
	}


	//Get film detail
	function getFilmDetail(obj){
		setFilmDetails(obj)
	}



	//sort films
	function sortBy(type){
		let sortedFilms = [...films];
		if (type==="episode"){
			sortedFilms.sort((a,b)=>{
				return a.episode_id - b.episode_id
		 });
		 setFilms(sortedFilms)
		}
		else{
			sortedFilms.sort((a,b)=>{
				return new Date(a.release_date) - new Date(b.release_date)
		 });
		 setFilms(sortedFilms)
		}
	}


  //search Films
	const searchBy = (e) => {
		if (e.target.value !== '') {
				const filteredData = APIData.filter((item) => {
						return item.title.toLowerCase().includes(e.target.value.toLowerCase())
				})
				setFilms(filteredData)
		}
		else{
			setFilms(APIData)
		}
  }
			

  return (
    <div className="App">

      <header className="App-header">
				<Container fluid className="bg-light p-3">
					<Row>

					  {/* search films */}
						<Col md={7} xs={8}>
							<Form.Control
								type="text"
								placeholder="Type to Search"
								className="me-2"
								aria-label="Search"
								name="search"
								onChange={searchBy}
							/>							  
						</Col>

						{/* sort films */}
						<Col md={5} xs={4}>
							<Dropdown>
								<Dropdown.Toggle  variant="light" id="dropdown-basic">
									Sort
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item onClick={()=>sortBy('episode')}>Episode</Dropdown.Item>
									<Dropdown.Item onClick={()=>sortBy('year')}>Year</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>
				</Container>
      </header>

      {/* content */}
      <section>
				<Container fluid className='mt-3'>
					{!isLoading ? <Row>

            {/* films table */}
						<Col md={7}>

							<Table striped bordered hover>
								<tbody>
								{films && films.length > 0 && films.map((filmObj, index) => (
                  <tr key={filmObj.episode_id} onClick={()=>getFilmDetail(filmObj)} style={{cursor:"pointer"}}>
										<td>Episode {filmObj.episode_id}</td>
										<td>Episode {integer_to_roman(filmObj.episode_id)} - {filmObj.title}</td>
										<td>{filmObj.release_date}</td>
									</tr>
                ))}
								</tbody>
							</Table>
						</Col>

            {/* film detail */}
						<Col md={5}>
							{filmDetails && filmDetails.episode_id && <Card>
								<Card.Body>
								  <Card.Title>Episode {integer_to_roman(filmDetails.episode_id)} - {filmDetails.title}</Card.Title>
									{filmDetails.opening_crawl}
									<br/><br/>
									<i>Directed By: {filmDetails.director}</i>
								</Card.Body>
							</Card>}
						</Col>
						
					</Row>: <div><Spinner animation="border" variant="secondary" /> Loading ...</div>}
				</Container>
			</section>


    </div>
  );
}

export default App;
