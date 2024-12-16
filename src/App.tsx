import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import Header from './components/Header';
import ToolSubmissionForm from './components/ToolSubmissionForm';
import ToolGrid from './components/ToolGrid';
import { Tool } from './types';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tools'));
        const toolsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tool[];
        setTools(toolsData);
      } catch (error) {
        console.error("Error fetching tools:", error);
      }
    };

    fetchTools();
  }, []);

  const handleNewTool = async (newTool: Tool) => {
    // Generate a temporary ID for immediate UI update
    const tempId = Date.now().toString();
    const toolWithId = { ...newTool, id: tempId };
    
    // Update UI immediately
    setTools(prev => [...prev, toolWithId]);

    try {
      // Add to Firestore in background
      const docRef = await addDoc(collection(db, 'tools'), newTool);
      
      // Update the temporary ID with the real Firestore ID
      setTools(prev => prev.map(tool => 
        tool.id === tempId ? { ...tool, id: docRef.id } : tool
      ));
    } catch (error) {
      console.error("Error adding tool:", error);
      // Remove the tool from UI if Firestore write failed
      setTools(prev => prev.filter(tool => tool.id !== tempId));
      toast.error("Failed to save tool");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Header />
        <ToolSubmissionForm onNewTool={handleNewTool} />
        <ToolGrid tools={tools} setTools={setTools} />
      </div>
      <Toaster />
    </div>
  );
};

export default App;