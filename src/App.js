import {useEffect, useState} from 'react'
import { Container ,Row, Col ,Table ,InputGroup ,Form,Button } from 'react-bootstrap'
import Pagination from './Pagination';


const App = () => {
  const[data ,setData]=useState([]);
  const [searchdata, setSearchdata]= useState([]);
  const[filterdata, setFilterdata] =useState('');

  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10; 
const totalPages = Math.ceil(data.length / itemsPerPage);

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};
 
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentData = data.slice(indexOfFirstItem, indexOfLastItem);


  const fetchdata =()=>{
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
    .then(async(response)=>{
      const result = await response.json();
      setData(result)
      setSearchdata(result)
    })
    .catch((error)=>
    console.log(error)
    )
  }

  const handlesearch =(e)=>{
    if(e.target.value == ""){
      setData(data)
      window.location.reload()
    }
    else{
      const filterresult = searchdata.filter(item=>item.name.toLowerCase().includes(e.target.value.toLowerCase()))
      setData(filterresult)
    }
    setFilterdata(e.target.value)

  };

  const handleDelete = (id) => {
    const newData = data.filter((item)=>item.id !== id);
    setData(newData);
  };

  useEffect(()=>{
    fetchdata()
  },[])
  return (
    <div className='bg-dark'>
     <Container>
         <Row className='justify-content-lg-center'>
            <Col lg={12}>
            <InputGroup className='my-4' size="lg">
        <InputGroup.Text id="inputGroup-sizing-lg">Search</InputGroup.Text>
        <Form.Control
         placeholder='type to search'
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          value={filterdata} onInput={(e)=>handlesearch(e)}
        />
      </InputGroup>
                <Table striped bordered hover>
                  
                    <thead>
                    <tr>
                       <th>NAME</th>
                       <th>EMAIL </th>
                       <th>ROLE</th>
                       <th>ACTION</th>
                       </tr>
                    </thead>
                    
                    <tbody>
                    {currentData.map((item, index) => {
    return (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.email}</td>
        <td>{item.role}</td>
        <td>
          <Button onClick={()=>handleDelete(item.id)}>Delete</Button>
        </td>
      </tr>
    );
  })}
                    </tbody>
                </Table>  
                <div>
  <Pagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={handlePageChange}
  />
</div>   
            </Col>
         </Row>
     </Container>
    </div>
  )
}

export default App ;