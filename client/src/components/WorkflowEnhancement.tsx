import { useState, useEffect } from 'react';

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  appName: string;
  url: string;
  action: string;
  dataNeeded: string[];
  dataProvided: string[];
  estimatedTime: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  estimatedTime: string;
  automation: string;
}

interface OrderData {
  id?: string;
  startedAt?: string;
  status?: string;
  template?: string;
  steps?: WorkflowStep[];
  [key: string]: any;
}

interface WorkflowHistoryItem extends OrderData {
  completedAt: string;
  status: string;
}
import { 
  Calculator, 
  FileText, 
  CreditCard, 
  Mail, 
  Download, 
  Clipboard, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ExternalLink,
  User,
  DollarSign,
  Package,
  Bell,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Zap
} from 'lucide-react';

const WorkflowEnhancement = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>({});
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistoryItem[]>([]);

  // Your actual app URLs and workflow steps
  const workflowSteps = [
    {
      id: 1,
      title: "Calculate Pricing",
      description: "Use POS System to calculate frame pricing",
      icon: <Calculator className="w-5 h-5" />,
      appName: "POS System",
      url: "https://frame-craft-pro-JayFrames.replit.app",
      action: "Calculate order pricing and get customer details",
      dataNeeded: ["Customer info", "Frame dimensions", "Materials"],
      dataProvided: ["Total price", "Materials list", "Customer data"],
      estimatedTime: "5 min"
    },
    {
      id: 2, 
      title: "Generate Invoice",
      description: "Auto-populate invoice from POS data",
      icon: <FileText className="w-5 h-5" />,
      appName: "Invoice Generator",
      url: "https://docs.google.com/document/d/1pJi-olmsZcyZ1w3da5Lq821udXxiFEbSHyP05HIMKJg/edit",
      action: "Create professional invoice with order details",
      dataNeeded: ["POS calculation data"],
      dataProvided: ["Invoice PDF", "Payment link"],
      estimatedTime: "2 min"
    },
    {
      id: 3,
      title: "Process Payment", 
      description: "Create Stripe checkout session",
      icon: <CreditCard className="w-5 h-5" />,
      appName: "Stripe Checkout",
      url: "#stripe-payment",
      action: "Create secure checkout session for customer payment",
      dataNeeded: ["Invoice total", "Customer email", "Order ID"],
      dataProvided: ["Payment link", "Session ID", "Payment status"],
      estimatedTime: "1 min"
    },
    {
      id: 4,
      title: "Send Invoice",
      description: "Email invoice and payment details to customer",
      icon: <Mail className="w-5 h-5" />,
      appName: "Email System",
      url: "mailto:",
      action: "Send professional invoice email to customer",
      dataNeeded: ["Customer email", "Invoice PDF", "Payment link"],
      dataProvided: ["Email confirmation"],
      estimatedTime: "1 min"
    },
    {
      id: 5,
      title: "Save to Drive",
      description: "Auto-upload invoice to Google Drive folder",
      icon: <Download className="w-5 h-5" />,
      appName: "Google Drive",
      url: "https://drive.google.com/drive/folders/1hG5k3uB0Q1LIt60EWSG2A-mqbsoc_RuE",
      action: "Upload invoice PDF directly to Jay's Frames invoices folder",
      dataNeeded: ["Invoice PDF", "Order number"],
      dataProvided: ["Stored invoice", "Drive link"],
      estimatedTime: "30 sec"
    },
    {
      id: 6,
      title: "Create Production Card",
      description: "Add order to Kanban for production tracking",
      icon: <Clipboard className="w-5 h-5" />,
      appName: "Kanban Board",
      url: "https://kanbanmain-JayFrames.replit.app",
      action: "Create production tracking card with all order details",
      dataNeeded: ["Complete order data", "Materials list", "Timeline"],
      dataProvided: ["Production card", "Status tracking"],
      estimatedTime: "2 min"
    },
    {
      id: 7,
      title: "Email with Invoice",
      description: "Send automated email with invoice attachment",
      icon: <Mail className="w-5 h-5" />,
      appName: "Email Automation",
      url: "mailto:",
      action: "Send professional email with invoice PDF automatically attached",
      dataNeeded: ["Customer email", "Invoice PDF from Drive"],
      dataProvided: ["Email sent", "Delivery confirmation"],
      estimatedTime: "30 sec"
    }
  ];

  const workflowTemplates = [
    {
      id: 'standard',
      name: 'Standard Order',
      description: 'Complete order processing from quote to production',
      steps: workflowSteps,
      estimatedTime: '10 min',
      automation: 'Streamlined with direct Drive access and auto-email'
    },
    {
      id: 'rush',
      name: 'Rush Order',
      description: 'Expedited processing for urgent orders',
      steps: workflowSteps.filter(s => [1, 2, 3, 6, 7].includes(s.id)),
      estimatedTime: '6 min',
      automation: 'Skip file storage, direct to production'
    },
    {
      id: 'quote',
      name: 'Quote Only',
      description: 'Generate quote without processing payment',
      steps: workflowSteps.filter(s => [1, 2, 7].includes(s.id)),
      estimatedTime: '4 min',
      automation: 'Quote and email only'
    }
  ];

  const startNewWorkflow = (templateId = 'standard') => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;
    
    const workflowId = `WF-${Date.now()}`;
    
    setActiveWorkflow(workflowId);
    setCurrentStep(0);
    setOrderData({
      id: `JF-${Date.now()}`,
      startedAt: new Date().toISOString(),
      status: 'in-progress',
      template: templateId,
      steps: template.steps
    });
  };

  const completeStep = (stepId: number, data: any = {}) => {
    setOrderData(prev => ({
      ...prev,
      [`step${stepId}`]: {
        completedAt: new Date().toISOString(),
        data: data
      }
    }));
    
    // Move to next step
    const currentSteps = orderData.steps || workflowSteps;
    const nextStepIndex = currentSteps.findIndex(s => s.id === stepId);
    if (nextStepIndex < currentSteps.length - 1) {
      setCurrentStep(nextStepIndex + 1);
    } else {
      // Workflow complete
      finishWorkflow();
    }
  };

  const finishWorkflow = () => {
    setWorkflowHistory(prev => [...prev, {
      ...orderData,
      completedAt: new Date().toISOString(),
      status: 'completed'
    }]);
    
    setActiveWorkflow(null);
    setCurrentStep(0);
    setOrderData({});
  };

  const openApp = (url: string, stepId: number) => {
    // Special handling for email with invoice
    if (stepId === 7) {
      const customerEmail = prompt("Enter customer email:");
      if (customerEmail) {
        const subject = `Invoice from Jay's Frames - Order ${orderData.id}`;
        const body = `Dear Customer,

Thank you for choosing Jay's Frames! Please find your invoice attached.

Your custom frame order details:
- Order ID: ${orderData.id}
- Date: ${new Date().toLocaleDateString()}

To make payment, please use the payment link provided or contact us at your convenience.

We'll begin production once payment is received and will keep you updated on progress.

Best regards,
Jay's Frames Team

---
This email was sent from the Jay's Frames Command Center`;
        
        const mailtoLink = `mailto:${customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
      }
    } else {
      window.open(url, '_blank');
    }
    
    // Mark step as active but don't auto-complete
    const currentSteps = orderData.steps || workflowSteps;
    const stepIndex = currentSteps.findIndex(s => s.id === stepId);
    setCurrentStep(stepIndex);
  };

  const getCurrentStep = () => {
    const currentSteps = orderData.steps || workflowSteps;
    return currentSteps[currentStep] || currentSteps[0];
  };

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Workflow Intelligence</h2>
            <p className="text-gray-600">Streamlined order processing automation</p>
          </div>
          <div className="flex space-x-3">
            {activeWorkflow ? (
              <>
                <div className="text-sm text-gray-500">
                  Active Order: <span className="font-medium text-blue-600">{orderData.id}</span>
                </div>
                <button 
                  onClick={() => setActiveWorkflow(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Pause className="w-4 h-4 inline mr-2" />
                  Pause Workflow
                </button>
              </>
            ) : (
              <button 
                onClick={() => startNewWorkflow()}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>Start New Order</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      {activeWorkflow && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4">Order Processing Progress</h3>
          <div className="flex items-center space-x-4 mb-6 overflow-x-auto">
            {(orderData.steps || workflowSteps).map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  index < currentStep ? 'bg-green-100 text-green-600 shadow-lg' :
                  index === currentStep ? 'bg-blue-100 text-blue-600 shadow-lg ring-2 ring-blue-300' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {index < currentStep ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                {index < (orderData.steps || workflowSteps).length - 1 && (
                  <ArrowRight className={`w-4 h-4 mx-3 transition-colors ${
                    index < currentStep ? 'text-green-400' : 'text-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {(orderData.steps || workflowSteps).length}: {getCurrentStep()?.title}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep) / (orderData.steps || workflowSteps).length) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {Math.round(((currentStep) / (orderData.steps || workflowSteps).length) * 100)}% complete
            </p>
          </div>
        </div>
      )}

      {/* Current Step Detail */}
      {activeWorkflow && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  {getCurrentStep()?.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {getCurrentStep()?.title}
                  </h3>
                  <p className="text-gray-600">{getCurrentStep()?.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-medium text-blue-900 mb-2">Action Required:</h4>
                  <p className="text-sm text-blue-700">{getCurrentStep()?.action}</p>
                  {getCurrentStep()?.id === 5 && (
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                      <strong>Mac Tip:</strong> After downloading PDF, drag directly to the opened Drive folder to avoid local saving step.
                    </div>
                  )}
                  {getCurrentStep()?.id === 6 && (
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                      <strong>Kanban Tips:</strong> Click "New Card" → Add customer name in title → Copy frame specs from POS to description
                    </div>
                  )}
                  {getCurrentStep()?.id === 7 && (
                    <div className="mt-2 p-2 bg-blue-100 rounded text-xs text-blue-800">
                      <strong>Email Automation:</strong> Email will auto-populate with professional invoice message and customer details
                    </div>
                  )}
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                  <h4 className="font-medium text-yellow-900 mb-2">You'll need:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {getCurrentStep()?.dataNeeded?.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                  <h4 className="font-medium text-green-900 mb-2">You'll get:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {getCurrentStep()?.dataProvided?.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Estimated time: {getCurrentStep()?.estimatedTime}</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => openApp(getCurrentStep()?.url, getCurrentStep()?.id)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 flex items-center space-x-2 shadow-lg transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open {getCurrentStep()?.appName}</span>
              </button>
              <button 
                onClick={() => completeStep(getCurrentStep()?.id)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 flex items-center space-x-2 shadow-lg transition-all"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Complete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Templates */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold mb-4">Workflow Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflowTemplates.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 cursor-pointer transition-all hover:shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  <div className="text-xs text-gray-500">{template.steps.length} steps • {template.estimatedTime}</div>
                </div>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              {!activeWorkflow && (
                <button 
                  onClick={() => startNewWorkflow(template.id)}
                  className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Start {template.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Automation Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-lg border border-purple-200 p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-900">Workflow Automation Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-medium text-purple-900 mb-2">🗂️ Google Drive Integration</h4>
            <p className="text-sm text-purple-700 mb-2">Direct link to your invoices folder:</p>
            <a 
              href="https://drive.google.com/drive/folders/1hG5k3uB0Q1LIt60EWSG2A-mqbsoc_RuE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Open Jay's Frames Invoices Folder
            </a>
            <p className="text-xs text-purple-600 mt-2">
              <strong>Mac Tip:</strong> Keep this folder open in a browser tab during workflow for direct drag-and-drop.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-medium text-purple-900 mb-2">📋 Kanban Integration</h4>
            <p className="text-sm text-purple-700 mb-2">Production tracking steps:</p>
            <ol className="text-xs text-purple-600 space-y-1">
              <li>1. Open Kanban app</li>
              <li>2. Click "Add Card" in "To Do"</li>
              <li>3. Title: Customer Name + Frame Size</li>
              <li>4. Description: Copy specs from POS</li>
              <li>5. Set due date and priority</li>
            </ol>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-medium text-purple-900 mb-2">📧 Email Automation</h4>
            <p className="text-sm text-purple-700 mb-2">Auto-generated email includes:</p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Professional greeting</li>
              <li>• Order details and ID</li>
              <li>• Payment instructions</li>
              <li>• Production timeline</li>
              <li>• Contact information</li>
            </ul>
            <p className="text-xs text-purple-600 mt-2">
              <strong>Note:</strong> You'll need to manually attach the invoice PDF from your downloads.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-purple-100">
            <h4 className="font-medium text-purple-900 mb-2">🎯 Professional Design</h4>
            <p className="text-sm text-purple-700 mb-2">Larson Juhl Designer Tool:</p>
            <a 
              href="https://shop.larsonjuhl.com/en-US/lj-design-studio?customizable=#maincontent" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Open Professional Frame Designer
            </a>
            <p className="text-xs text-purple-600 mt-2">
              <strong>Use for:</strong> Advanced frame designs, premium materials, professional mockups and customer presentations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Tool Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Access Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {workflowSteps.map((step) => (
            <div key={step.id} className="text-center">
              <button
                onClick={() => openApp(step.url, step.id)}
                className={`w-16 h-16 rounded-xl flex items-center justify-center mb-2 transition-all shadow-lg ${
                  activeWorkflow && getCurrentStep()?.id === step.id 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-300 shadow-xl' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {step.icon}
              </button>
              <div className="text-xs font-medium text-gray-900">{step.appName}</div>
              <div className="text-xs text-gray-500">{step.estimatedTime}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workflow History */}
      {workflowHistory.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {workflowHistory.slice(-5).map((workflow, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <span className="font-medium text-gray-900">{workflow.id}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    {new Date(workflow.completedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowEnhancement;