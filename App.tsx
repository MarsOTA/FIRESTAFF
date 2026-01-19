
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { StaffView } from './components/StaffView';
import { TemplateCreator } from './components/TemplateCreator';
import { CalendarView } from './components/CalendarView';
import { OlympicGenerator } from './components/OlympicGenerator';
import { ScreenType, UserRole, OperationalEvent } from './types';
import { MOCK_EVENTS } from './constants';

const App: React.FC = () => {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('DASHBOARD');
  const [currentRole, setCurrentRole] = useState<UserRole>('COMPILATORE_A');
  const [currentDate, setCurrentDate] = useState('');
  const [events, setEvents] = useState<OperationalEvent[]>(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState('2025-02-17');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', hour12: false 
      };
      // Usiamo locale it-IT per avere il formato dd/mm/yyyy
      const formatted = now.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const dayName = now.toLocaleDateString('it-IT', { weekday: 'short' }).toUpperCase();
      const time = now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      setCurrentDate(`${dayName} ${formatted} • ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSaveEvent = (newEvent: OperationalEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setSelectedDate(newEvent.date);
    setActiveScreen('DASHBOARD');
  };

  return (
    <div className="h-full w-full font-sans antialiased text-slate-700">
      <Layout activeScreen={activeScreen} setScreen={setActiveScreen} role={currentRole} setRole={setCurrentRole} date={currentDate}>
        {activeScreen === 'DASHBOARD' && <Dashboard events={events} setEvents={setEvents} role={currentRole} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {activeScreen === 'STAFF' && <StaffView />}
        {activeScreen === 'CREAZIONE' && <TemplateCreator onSave={handleSaveEvent} defaultDate={selectedDate} />}
        {activeScreen === 'CALENDAR' && <CalendarView events={events} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />}
        {activeScreen === 'GENERATORE' && <OlympicGenerator />}
      </Layout>
    </div>
  );
};

export default App;
