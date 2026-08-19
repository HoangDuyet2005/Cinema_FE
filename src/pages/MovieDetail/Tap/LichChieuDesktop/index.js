import React, { useEffect, useState } from 'react';
import useStyles from './style';
import theatersApi from '../../../../api/theatersApi';
import { useParams } from "react-router-dom";
import formatDate from "../../../../utilities/formatDate";
import BtnGoToCheckOut from '../../../../components/BtnGoToCheckOut';

export default function LichChieuDesktop({ data }) {
  const classes = useStyles();
  const param = useParams();
  const [schedules, setSchedules] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    theatersApi.getThongTinLichChieuPhim(param.maPhim, null)
      .then((response) => {
        const allSchedules = response?.data?.data?.content || [];
        setSchedules(allSchedules);
        
        const uniqueDates = [...new Set(allSchedules.map(s => s.startDate))].sort();
        setDates(uniqueDates);
        if (uniqueDates.length > 0) {
          setSelectedDate(uniqueDates[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [param.maPhim]);

  const schedulesForDate = schedules.filter(s => s.startDate === selectedDate);
  
  // Group by branch
  const branchesMap = {};
  schedulesForDate.forEach(s => {
    const bId = s.branch.id;
    if (!branchesMap[bId]) {
      branchesMap[bId] = { branch: s.branch, schedules: [] };
    }
    branchesMap[bId].schedules.push(s);
  });
  const branches = Object.values(branchesMap);

  return (
    <div className={classes.root} style={{ flexDirection: 'column', width: '100%', padding: '20px', minHeight: 'auto' }}>
      <div className={classes.listDay} style={{ borderBottom: '1px solid #ccc', marginBottom: '20px', paddingBottom: '10px', overflowX: 'auto', display: 'flex', whiteSpace: 'nowrap' }}>
        {dates.length === 0 && <p style={{ padding: 10 }}>Không có lịch chiếu cho phim này!</p>}
        {dates.map((day, i) => (
          <div
            className={classes.dayItem}
            key={day}
            style={{ 
              color: day === selectedDate ? "#fb4226" : "#000",
              borderBottom: day === selectedDate ? "3px solid #fb4226" : "none",
              marginRight: "20px",
              paddingBottom: "10px",
              cursor: "pointer",
              fontWeight: day === selectedDate ? "bold" : "normal",
              display: "inline-block"
            }}
            onClick={() => setSelectedDate(day)}
          >
            <p style={{ margin: 0, fontSize: "18px" }}>{formatDate(day).dateFull}</p>
          </div> 
        ))}
      </div>

      <div className={classes.rightSection} style={{ width: '100%' }}>
        {branches.map(b => (
          <div key={b.branch.id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              
              <div>
                <h5 style={{ fontWeight: 'bold', margin: 0, fontSize: '16px' }}>{b.branch.name}</h5>
                <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{b.branch.address}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px' }}>
              {b.schedules.map(lichChieu => (
                <div key={lichChieu.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                  <span style={{ fontSize: '12px', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>{lichChieu.room.name}</span>
                  <BtnGoToCheckOut 
                    lichChieuTheoPhim={lichChieu?.startTime} 
                    duration={lichChieu?.movie?.duration} 
                    idLich={lichChieu?.id} 
                    maPhim={param.maPhim} 
                    ngayChieu={lichChieu?.startDate}
                    maPhong={lichChieu?.room?.id}
                    gioChieu={lichChieu?.startTime}
                    maRap={lichChieu?.branch?.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

