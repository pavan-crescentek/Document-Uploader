import classnames from 'classnames';
import moment from 'moment';
import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Col,
  Collapse,
  ListGroup,
  ListGroupItem,
  OffcanvasBody,
  Row,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';
import './grounds.css';

const GroundBookings = ({ data }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <>
      <OffcanvasBody className="p-0 overflow-hidden">
        <SimpleBar style={{ height: '100%' }}>
          <div className="acitivity-timeline p-4">
            <Accordion id="default-accordion-example">
              {data &&
                data.length > 0 &&
                data.map((singleRecord, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <AccordionItem className="material-shadow">
                      <Row
                        className={classnames(
                          'accordion-button accordion-header m-0',
                          {
                            collapsed: !isOpen,
                          }
                        )}
                        style={{ cursor: 'pointer' }}
                        onClick={() => toggle(index)}
                      >
                        <Col className="col-auto">
                          <div className="avatar-sm p-1 py-2 h-auto bg-light rounded-3 material-shadow">
                            <div className="text-center">
                              <h5 className="mb-0">
                                {moment(singleRecord.booking_date).date()}
                              </h5>
                              <div className="text-muted">
                                {moment(singleRecord.booking_date).format(
                                  'ddd'
                                )}
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col className="col">
                          <div className="flex-grow-1 align-self-center">
                            <div className="text-muted">
                              <h5>{singleRecord?.user?.name}</h5>
                              <p className="mb-1">
                                Email Id : {singleRecord?.user?.email}
                              </p>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Collapse
                        isOpen={isOpen}
                        className="accordion-collapse"
                        id="collapseOne"
                      >
                        <div className="accordion-body">
                          <ListGroup
                            className="border-dashed p-3 accordion-body"
                            flush
                          >
                            {singleRecord?.booking_slots?.length > 0 &&
                              singleRecord?.booking_slots.map((item, key) => (
                                <ListGroupItem className="ps-0" key={key}>
                                  <Row className="align-items-center g-3">
                                    <Col className="col">
                                      <h5 className="text-muted mt-0 mb-1 fs-13">
                                        {item.slot}
                                      </h5>
                                      <span className="text-reset fs-14 mb-0 d-flex gap-2 align-items-center">
                                        <h5 className="text-muted m-0 fs-13">
                                          Price:
                                        </h5>{' '}
                                        {item.price}
                                      </span>
                                    </Col>
                                  </Row>
                                </ListGroupItem>
                              ))}
                          </ListGroup>
                        </div>
                      </Collapse>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </div>
        </SimpleBar>
      </OffcanvasBody>
    </>
  );
};

export default GroundBookings;
