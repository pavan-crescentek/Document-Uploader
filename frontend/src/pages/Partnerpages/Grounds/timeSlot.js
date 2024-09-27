import moment from 'moment/moment';
import React, { useState } from 'react';
import { FormGroup, Input, Label, OffcanvasBody, Table } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import Loader from '../../../Components/Common/Loader';
import './grounds.css';

const TimeSlot = ({
  data,
  toggleRightCanvas,
  updateSlots,
  selectedGround,
  addEditLoading,
}) => {
  const [scheduleData, setScheduleData] = useState(data);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handlePriceChange = (dayIndex, slotIndex, newPrice) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[dayIndex].slots[slotIndex].price = newPrice;
    setScheduleData(updatedSchedule);
  };

  const handleActiveToggle = (dayIndex, slotIndex) => {
    const updatedSchedule = [...scheduleData];
    updatedSchedule[dayIndex].slots[slotIndex].active =
      !updatedSchedule[dayIndex].slots[slotIndex].active;
    setScheduleData(updatedSchedule);
  };

  const handleSubmit = () => {
    updateSlots({ ground_id: selectedGround, slots: scheduleData });
  };

  const handleCancel = () => {
    toggleRightCanvas();
  };

  return (
    <>
      <OffcanvasBody className="p-0 overflow-hidden slot-canvas">
        <SimpleBar style={{ height: '100%' }}>
          <div className="acitivity-timeline p-4">
            <Table bordered>
              <thead>
                <tr>
                  <th>Hour</th>
                  {scheduleData.map((day) => (
                    <th key={day.id}>{day.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => {
                  const startTime = moment({ hour });
                  const endTime = startTime.clone().add(1, 'hour');

                  return (
                    <tr key={hour}>
                      <td className="hourly-td">{`${startTime.format('h:mm A')} - ${endTime.format('h:mm A')}`}</td>
                      {scheduleData.map((day, dayIndex) => {
                        const slot = day.slots.find((slot) => {
                          const slotTime = moment(slot.slot, 'h:mm A');
                          return (
                            slotTime.hour() === startTime.hour() &&
                            slotTime.format('A') === startTime.format('A')
                          );
                        });

                        return (
                          <td key={`${day.id}-${hour}`}>
                            {slot ? (
                              <>
                                <FormGroup check inline className="mb-2">
                                  <Label check>
                                    <Input
                                      type="checkbox"
                                      checked={slot.active}
                                      onChange={() =>
                                        handleActiveToggle(
                                          dayIndex,
                                          day.slots.indexOf(slot)
                                        )
                                      }
                                    />
                                    &nbsp;Active
                                  </Label>
                                </FormGroup>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    value={slot.price}
                                    onChange={(e) => {
                                      handlePriceChange(
                                        dayIndex,
                                        day.slots.indexOf(slot),
                                        e.target.value
                                      );
                                    }}
                                  />
                                </FormGroup>
                              </>
                            ) : (
                              <>
                                <FormGroup check inline>
                                  <Label check>
                                    <Input type="checkbox" disabled />
                                    Inactive
                                  </Label>
                                </FormGroup>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    placeholder="Add price"
                                    onChange={(e) =>
                                      handlePriceChange(
                                        dayIndex,
                                        dayIndex,
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormGroup>
                              </>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </SimpleBar>
      </OffcanvasBody>
      <div className="offcanvas-foorter border-top p-3 text-center actionButons">
        <button
          className="margin-right-20px btn btn-light"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`position-relative btn btn-success ${addEditLoading && 'opacity-75'}`}
          disabled={addEditLoading}
        >
          {addEditLoading && (
            <span className="position-absolute loader-wrapper">
              <Loader error={null} />
            </span>
          )}
          Submit
        </button>
      </div>
    </>
  );
};

export default TimeSlot;
