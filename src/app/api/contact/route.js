// app/api/contact/route.js
import { NextResponse } from 'next/server';

// This would typically connect to a database
// For now, we'll simulate database operations
const contactRequests = [];

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      phone,
      businessName,
      message,
      preferredPlan,
      websiteType,
      budget,
      timeline
    } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Create contact request
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    const newRequest = {
      id: requestId,
      name,
      email,
      phone,
      businessName,
      message,
      preferredPlan,
      websiteType,
      budget,
      timeline,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    // Save contact request (would normally go to database)
    contactRequests.push(newRequest);
    
    // In a real app, you would also:
    // 1. Send an email notification to the admin
    // 2. Send a confirmation email to the customer
    
    // Return success
    return NextResponse.json({
      success: true,
      requestId,
      message: 'Your consultation request has been submitted successfully!'
    });
    
  } catch (error) {
    console.error('Contact request error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while submitting your request' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all contact requests (admin endpoint)
export async function GET(request) {
  // In a real app, this would require authentication/authorization
  
  return NextResponse.json({
    success: true,
    contactRequests
  });
}

// PUT endpoint to update a contact request status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { requestId, status, notes } = body;
    
    if (!requestId || !status) {
      return NextResponse.json(
        { success: false, message: 'Request ID and status are required' },
        { status: 400 }
      );
    }
    
    // Find request index
    const requestIndex = contactRequests.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Contact request not found' },
        { status: 404 }
      );
    }
    
    // Valid status values
    const validStatuses = [
      'new', 
      'contacted', 
      'consultation_scheduled', 
      'quoted',
      'converted',
      'closed'
    ];
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    // Update the contact request
    contactRequests[requestIndex] = {
      ...contactRequests[requestIndex],
      status,
      notes: notes || contactRequests[requestIndex].notes,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      contactRequest: contactRequests[requestIndex],
      message: 'Contact request updated successfully'
    });
    
  } catch (error) {
    console.error('Contact request update error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while updating the contact request' },
      { status: 500 }
    );
  }
}