import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from '../../components/common/Header';
import { addvehicleAPI } from '../../services/allAPI';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    REGNO: '',
    BUSNO: '',
    ALLOTTEDDEPOT: '',
    CLASS: '',
    status: 'in_service',
    maintenance_history: [],
  });

   // Function to reset form fields and states
   const handleCancel = () => {
    // Reset vehicle data state to empty values
    setVehicleData({
      REGNO: '',
      BUSNO: '',
      ALLOTTEDDEPOT: '',
      CLASS: '',
      status: 'in_service',
      maintenance_history: [],
    });
    // Reset search state to empty values
    setSearch({ vehicleClass: '', depot: '' });
    // Reset selected state to empty values
    setSelected({ vehicleClass: '', depot: '' });
  };

  const [search, setSearch] = useState({
    vehicleClass: '',
    depot: ''
  });
  const [dropdownsOpen, setDropdownsOpen] = useState({
    vehicleClass: false,
    depot: false
  });
  const [selected, setSelected] = useState({
    vehicleClass: '',
    depot: ''
  });

  const vehicleClasses = [
    { name: 'AC PREMIUM SF', id: '1' },
    { name: 'BB AC SEATER', id: '2' },
    { name: 'CLASS', id: '3' },
    { name: 'ELECTRIC', id: '4' },
    { name: 'EL DD', id: '5' },
    { name: 'FP', id: '6' },
    { name: 'JN AC', id: '7' },
    { name: 'JN NAC', id: '8' },
    { name: 'ORD', id: '9' },
    { name: 'S/DLX', id: '10' },
    { name: 'S/EXP', id: '11' },
    { name: 'SEATER CUM SLEEPER AC', id: '12' },
    { name: 'SEATER CUM SLEEPER NON AC', id: '13' },
    { name: 'SEMI SLEEPER', id: '14' },
    { name: 'SFP', id: '15' },
    { name: 'SP', id: '16' },
    { name: 'SSFP', id: '17' },
    { name: 'SWIFT AC SEATER', id: '18' },
    { name: 'SWIFT DLX', id: '19' },
    { name: 'SWIFT SLEEPER', id: '20' }
  ];

  const depots = [
    'ADR', 'ALP', 'ALY', 'ANK', 'ARD', 'ARK', 'ATL', 'CDM', 'CGR', 'CHT', 'CHY',
    'CLD', 'CTL', 'CTR', 'EDT', 'EKM', 'EMY', 'ETP', 'GVR', 'HPD', 'IJK', 'KDR',
    'KGD', 'KHD', 'KKD', 'KKM', 'KLM', 'KLP', 'KMG', 'KMR', 'KMY', 'KNI', 'KNP',
    'KNR', 'KPM', 'KPT', 'KTD', 'KTM', 'KTP', 'KTR', 'KYM', 'MKD', 'MLA', 'MLP',
    'MLT', 'MND', 'MNR', 'MPY', 'MVK', 'MVP', 'NBR', 'NDD', 'NDM', 'NPR', 'NTA',
    'PBR', 'PDK', 'PDM', 'PLA', 'PLD', 'PLK', 'PLR', 'PMN', 'PNI', 'PNK', 'PNR',
    'PPD', 'PPM', 'PRK', 'PSL', 'PTA', 'PVM', 'PVR', 'RNI', 'SBY', 'TDP', 'TDY',
    'TLY', 'TMY', 'TPM', 'TSR', 'TVL', 'TVM CL', 'TVM CTY', 'TVRA', 'VDA', 'VDY',
    'VJD', 'VKB', 'VKM', 'VLD', 'VRD', 'VTR', 'VZM'
  ];


  const handleSearchChange = (type, value) => {
    setSearch(prevSearch => ({ ...prevSearch, [type]: value }));
  };

  const handleDropdownToggle = (type) => {
    setDropdownsOpen(prevState => ({ ...prevState, [type]: !prevState[type] }));
  };

  const handleBlur = (type) => {
    setTimeout(() => setDropdownsOpen(prevState => ({ ...prevState, [type]: false })), 200);
  };

  const handleSelectionChange = (type, value) => {
    setSelected(prevSelected => ({ ...prevSelected, [type]: value }));
    setSearch(prevSearch => ({ ...prevSearch, [type]: value }));
    setDropdownsOpen(prevState => ({ ...prevState, [type]: false }));

    if (type === 'vehicleClass') {
      setVehicleData(prevData => ({
        ...prevData,
        CLASS: value
      }));
    } else if (type === 'depot') {
      setVehicleData(prevData => ({
        ...prevData,
        ALLOTTEDDEPOT: value
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission to handle it manually
    console.log("Submitting vehicle data:", vehicleData);

    try {
      // API call to add vehicle
      const result = await addvehicleAPI(vehicleData);
      console.log("API Response:", result); // Log entire response for debugging

      // Handle different response statuses from the server
      if (result.status === 406) {
        alert('Vehicle already exists');
      } else if (result.status === 201) {
        // Reset form state after successful submission
        alert('Vehicle successfully added');
        setVehicleData({
          CLASS: '',
          BUSNO: '',
          REGNO: '',
          ALLOTTEDDEPOT: '',
          status: 'in_service', // Default to 'in_service' if not provided
          maintenance_history: [],
        });
        setSelected({ vehicleClass: '', depot: '' }); // Reset other related states
      } else {
        alert('Unexpected response from server');
      }
    } catch (error) {
      // Handle detailed error scenarios
      if (error.response) {
        const httpStatus = error.response.status;
        const responseMessage = error.response.data?.message || "Unexpected error occurred";
        console.error("Server response error:", error.response);

        // Display appropriate error messages based on HTTP status code
        if (httpStatus === 500) {
          alert("Internal Server Error: Please try again later.");
        } else if (httpStatus === 404) {
          alert("Not Found: The requested resource could not be located.");
        } else {
          alert(`Server error: ${responseMessage}`);
        }
      } else {
        // Handle network errors or if error.response doesn't exist
        console.error("Network error:", error);
        alert('Network error: Please check your connection and try again.');
      }
    }
  };

  const filteredVehicleClasses = vehicleClasses.filter(vehicleClass =>
    vehicleClass.name.toLowerCase().includes(search.vehicleClass.toLowerCase())
  );
  const filteredDepots = depots.filter(depot =>
    depot.toLowerCase().includes(search.depot.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div style={{ backgroundColor: "#f1f1f1", padding: "20px" }}>
        <Container fluid>
          <Row>
            <Col xs={2}></Col>
            <Col xs={9}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faBus} className="me-2 text-primary" />
                    Vehicle Details
                  </Card.Title>
                  <hr className="mb-4" />
                  <h5 className="text-start">1. VEHICLE INFORMATION</h5>

                  <Form onSubmit={handleSubmit}>
                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group controlId="vehicleClass">
                          <Form.Label>Vehicle Class</Form.Label>
                          <Form.Control
                            value={search.vehicleClass}
                            onChange={(e) => handleSearchChange('vehicleClass', e.target.value)}
                            onFocus={() => handleDropdownToggle('vehicleClass')}
                            onBlur={() => handleBlur('vehicleClass')}
                            placeholder="Search or select a vehicle class"
                          />
                          {dropdownsOpen.vehicleClass && (
                            <div style={{ border: '1px solid #ddd', marginTop: '5px', padding: '10px' }}>
                              {filteredVehicleClasses.length > 0 ? (
                                filteredVehicleClasses.map((vehicleClass, index) => (
                                  <Form.Check
                                    type="radio"
                                    label={vehicleClass.name}
                                    value={vehicleClass.name}
                                    checked={selected.vehicleClass === vehicleClass.name}
                                    onChange={() => handleSelectionChange('vehicleClass', vehicleClass.name)}
                                    key={index}
                                  />
                                ))
                              ) : (
                                <div>No matching vehicle classes found</div>
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Label>Registration No</Form.Label>
                        <Form.Control
                          value={vehicleData.REGNO}
                          type="text"
                          name="REGNO"
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Label>Bus No</Form.Label>
                        <Form.Control
                          value={vehicleData.BUSNO}
                          type="text"
                          name="BUSNO"
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="depot">
                          <Form.Label>Depot</Form.Label>
                          <Form.Control
                            value={search.depot}
                            onChange={(e) => handleSearchChange('depot', e.target.value)}
                            onFocus={() => handleDropdownToggle('depot')}
                            onBlur={() => handleBlur('depot')}
                            placeholder="Search or select a depot"
                          />
                          {dropdownsOpen.depot && (
                            <div style={{ border: '1px solid #ddd', marginTop: '5px', padding: '10px' }}>
                              {filteredDepots.length > 0 ? (
                                filteredDepots.map((depot, index) => (
                                  <Form.Check
                                    type="radio"
                                    label={depot}
                                    value={depot}
                                    checked={selected.depot === depot}
                                    onChange={() => handleSelectionChange('depot', depot)}
                                    key={index}
                                  />
                                ))
                              ) : (
                                <div>No matching depots found</div>
                              )}
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row className="mt-4">
                      <Col className="d-flex justify-content-end">
                        <Button variant="outline-secondary" onClick={handleCancel} size="sm" className="me-2">
                          <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancel
                        </Button>
                        <Button type="submit" variant="success" size="sm">Add</Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={1}></Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AddVehicle;
