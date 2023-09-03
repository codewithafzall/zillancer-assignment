import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  InputGroup,
  Form,
  Button,
} from "react-bootstrap";
import Pagination from "./Pagination";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  const [searchdata, setSearchdata] = useState([]);
  const [filterdata, setFilterdata] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setData(response.data);
      setSearchdata(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlesearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    if (searchValue == "") {
      setData(data);
    } else {
      const filterResult = searchdata.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue) ||
          item.email.toLowerCase().includes(searchValue) ||
          item.role.toLowerCase().includes(searchValue)
      );
      setData(filterResult);
    }
    setFilterdata(e.target.value);
  };

  const handleDelete = (id) => {
    const newData = data.filter((item) => item.id !== id);
    setData(newData);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAllChecked(checked);
  
    const updatedData = currentData.map((item) => {
      return { ...item, selected: checked };
    });
  
    const updatedFullData = data.map((item) => {
      const currentPageItem = updatedData.find((pageItem) => pageItem.id === item.id);
      if (currentPageItem) {
        return currentPageItem;
      }
      return item;
    });
  
    setData(updatedFullData);
  };
  

  const handleCheckboxChange = (id) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleDeleteSelected = () => {
    const updatedData = data.filter((item) => !item.selected);
    setData(updatedData);
    setSelectAllChecked(false);
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="bg-dark" style={{height:"118vh"}}>
      <Container>
        <Row className="justify-content-lg-center">
          <Col lg={12}>
            <InputGroup className="my-4" size="lg">
              <InputGroup.Text id="inputGroup-sizing-lg">
                Search
              </InputGroup.Text>
              <Form.Control
                placeholder="type to search"
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                value={filterdata}
                onInput={(e) => handlesearch(e)}
              />
            </InputGroup>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th style={{ width: "100px" }}>
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      onChange={handleSelectAll}
                    />
                    Select All
                  </th>
                  <th>NAME</th>
                  <th>EMAIL </th>
                  <th>ROLE</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item) => {
                  return (
                    <tr key={item.id} >
                      <td>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.role}</td>
                      <td>
                        <Button onClick={() => handleDelete(item.id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Button className="mb-4" variant='danger' size="lg" onClick={handleDeleteSelected}>Delete Selected</Button>
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
  );
};

export default App;
