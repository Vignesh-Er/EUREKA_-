// ============================================
// Project Eureka - Mock Data Store
// AI Academic Intelligence Platform
// ============================================

import type {
  Lab,
  Specialization,
  Course,
  ContextCard,
  StudentProfile,
  Badge,
  LearningRoadmap,
  Assessment,
  Question,
  Lecture,
  LectureCompanion,
  Feedback,
  HardwareRequest,
  ProfessorProfile,
} from './types'

// ============================================
// Labs Data
// ============================================
export const labs: Lab[] = [
  {
    id: 'lab-vlsi',
    name: 'VLSI Design Laboratory',
    shortName: 'VLSI Lab',
    description: 'State-of-the-art facility for chip design, FPGA prototyping, and ASIC verification with industry-standard EDA tools.',
    purpose: 'Design and prototype integrated circuits from concept to silicon, covering digital, analog, and mixed-signal domains.',
    projects: [
      {
        id: 'proj-riscv',
        name: 'RISC-V Processor Implementation',
        description: 'Design a 5-stage pipelined RISC-V processor with branch prediction and cache hierarchy.',
        difficulty: 'advanced',
        technologies: ['Verilog', 'SystemVerilog', 'Vivado', 'ModelSim'],
        duration: '4 months',
        outcomes: ['RTL design skills', 'Verification methodology', 'FPGA deployment']
      },
      {
        id: 'proj-cnn-acc',
        name: 'CNN Hardware Accelerator',
        description: 'Build a custom accelerator for convolutional neural network inference on FPGA.',
        difficulty: 'advanced',
        technologies: ['HLS', 'Verilog', 'TensorFlow Lite', 'Zynq'],
        duration: '3 months',
        outcomes: ['AI hardware design', 'Optimization techniques', 'Power analysis']
      },
      {
        id: 'proj-dsp-filter',
        name: 'DSP Filter Bank',
        description: 'Implement a reconfigurable FIR/IIR filter bank for audio processing applications.',
        difficulty: 'intermediate',
        technologies: ['Verilog', 'MATLAB', 'Vivado HLS'],
        duration: '6 weeks',
        outcomes: ['DSP implementation', 'Fixed-point arithmetic', 'Resource optimization']
      }
    ],
    researchAreas: ['AI Hardware Acceleration', 'Low-Power Design', 'High-Speed Interfaces', 'Neuromorphic Computing'],
    industryConnections: ['Semiconductor companies', 'AI chip startups', 'Automotive electronics', 'Consumer electronics'],
    requiredSkills: ['Digital logic', 'Verilog/VHDL', 'Computer architecture', 'Signal processing basics'],
    relatedCourses: ['Digital Design', 'Computer Architecture', 'VLSI Design', 'Embedded Systems'],
    equipment: ['Xilinx Ultrascale+ FPGAs', 'Cadence Virtuoso', 'Synopsys Design Compiler', 'Logic Analyzers'],
    capacity: 30,
    location: 'Engineering Building, Room 401'
  },
  {
    id: 'lab-robotics',
    name: 'Robotics & Automation Laboratory',
    shortName: 'Robotics Lab',
    description: 'Cutting-edge robotics facility with industrial manipulators, mobile robots, and autonomous systems.',
    purpose: 'Design, build, and program robotic systems for industrial automation, healthcare, and exploration applications.',
    projects: [
      {
        id: 'proj-arm',
        name: '6-DOF Robotic Arm Control',
        description: 'Implement inverse kinematics and path planning for a 6-axis industrial manipulator.',
        difficulty: 'advanced',
        technologies: ['ROS2', 'Python', 'MoveIt', 'Gazebo'],
        duration: '3 months',
        outcomes: ['Motion planning', 'Control systems', 'ROS proficiency']
      },
      {
        id: 'proj-slam',
        name: 'SLAM-based Navigation',
        description: 'Develop simultaneous localization and mapping for autonomous mobile robots.',
        difficulty: 'advanced',
        technologies: ['ROS2', 'C++', 'LiDAR', 'OpenCV'],
        duration: '4 months',
        outcomes: ['Sensor fusion', 'State estimation', 'Real-time systems']
      }
    ],
    researchAreas: ['Autonomous Navigation', 'Human-Robot Interaction', 'Swarm Robotics', 'Surgical Robotics'],
    industryConnections: ['Automotive OEMs', 'Logistics companies', 'Healthcare robotics', 'Aerospace'],
    requiredSkills: ['Control systems', 'Programming (Python/C++)', 'Linear algebra', 'Mechanics'],
    relatedCourses: ['Control Systems', 'Robotics', 'Machine Learning', 'Embedded Systems'],
    equipment: ['UR5e Cobots', 'TurtleBot4', 'Velodyne LiDAR', 'Intel RealSense', 'Motion Capture System'],
    capacity: 25,
    location: 'Engineering Building, Room 301'
  },
  {
    id: 'lab-signal',
    name: 'Signal Processing Laboratory',
    shortName: 'Signal Lab',
    description: 'Advanced signal processing facility for communication systems, radar, and audio/image processing.',
    purpose: 'Analyze, transform, and synthesize signals across multiple domains including wireless, audio, and biomedical.',
    projects: [
      {
        id: 'proj-radar',
        name: 'FMCW Radar System',
        description: 'Build a frequency-modulated continuous wave radar for range and velocity detection.',
        difficulty: 'advanced',
        technologies: ['MATLAB', 'SDR', 'Python', 'RF Design'],
        duration: '3 months',
        outcomes: ['Radar signal processing', 'RF systems', 'Target detection algorithms']
      },
      {
        id: 'proj-beamform',
        name: 'Adaptive Beamforming Array',
        description: 'Implement digital beamforming algorithms for antenna array signal enhancement.',
        difficulty: 'intermediate',
        technologies: ['MATLAB', 'Python', 'NumPy', 'SDR'],
        duration: '8 weeks',
        outcomes: ['Array processing', 'Adaptive filtering', 'Direction estimation']
      }
    ],
    researchAreas: ['5G/6G Communications', 'Radar Systems', 'Biomedical Signal Processing', 'Audio Enhancement'],
    industryConnections: ['Telecom companies', 'Defense contractors', 'Medical device companies', 'Audio companies'],
    requiredSkills: ['Signals and systems', 'Fourier analysis', 'MATLAB/Python', 'Probability theory'],
    relatedCourses: ['Signals and Systems', 'Digital Signal Processing', 'Communication Systems', 'Random Processes'],
    equipment: ['USRP Software-Defined Radios', 'Spectrum Analyzers', 'Oscilloscopes', 'Antenna Arrays'],
    capacity: 20,
    location: 'Engineering Building, Room 205'
  },
  {
    id: 'lab-ai',
    name: 'Artificial Intelligence Laboratory',
    shortName: 'AI Lab',
    description: 'GPU-accelerated computing facility for machine learning, deep learning, and AI research.',
    purpose: 'Train, deploy, and research AI models for computer vision, NLP, reinforcement learning, and more.',
    projects: [
      {
        id: 'proj-llm',
        name: 'Domain-Specific LLM Fine-tuning',
        description: 'Fine-tune large language models for specialized academic and technical domains.',
        difficulty: 'advanced',
        technologies: ['PyTorch', 'Transformers', 'PEFT', 'Weights & Biases'],
        duration: '2 months',
        outcomes: ['LLM expertise', 'Fine-tuning techniques', 'Evaluation methods']
      },
      {
        id: 'proj-cv',
        name: 'Real-time Object Detection',
        description: 'Deploy efficient object detection models on edge devices for real-time inference.',
        difficulty: 'intermediate',
        technologies: ['PyTorch', 'YOLO', 'TensorRT', 'Jetson'],
        duration: '6 weeks',
        outcomes: ['Model optimization', 'Edge deployment', 'Performance profiling']
      }
    ],
    researchAreas: ['Large Language Models', 'Computer Vision', 'Reinforcement Learning', 'AI Safety'],
    industryConnections: ['Tech giants', 'AI startups', 'Healthcare AI', 'Autonomous vehicles'],
    requiredSkills: ['Python', 'Linear algebra', 'Probability', 'Deep learning fundamentals'],
    relatedCourses: ['Machine Learning', 'Deep Learning', 'Computer Vision', 'Natural Language Processing'],
    equipment: ['NVIDIA A100 GPUs', 'Jetson Edge Devices', 'High-Performance Computing Cluster'],
    capacity: 40,
    location: 'Computer Science Building, Room 501'
  },
  {
    id: 'lab-embedded',
    name: 'Embedded Systems Laboratory',
    shortName: 'Embedded Lab',
    description: 'Comprehensive facility for embedded system design, IoT, and real-time computing.',
    purpose: 'Design resource-constrained computing systems for IoT, automotive, and industrial applications.',
    projects: [
      {
        id: 'proj-rtos',
        name: 'RTOS from Scratch',
        description: 'Build a minimal real-time operating system kernel with task scheduling and IPC.',
        difficulty: 'advanced',
        technologies: ['C', 'ARM Assembly', 'STM32', 'JTAG'],
        duration: '3 months',
        outcomes: ['OS internals', 'Real-time systems', 'Low-level programming']
      },
      {
        id: 'proj-iot',
        name: 'Industrial IoT Gateway',
        description: 'Create a secure IoT gateway with edge computing and cloud connectivity.',
        difficulty: 'intermediate',
        technologies: ['ESP32', 'MQTT', 'AWS IoT', 'FreeRTOS'],
        duration: '8 weeks',
        outcomes: ['IoT architecture', 'Security protocols', 'Cloud integration']
      }
    ],
    researchAreas: ['Edge Computing', 'Cyber-Physical Systems', 'Wearable Electronics', 'Automotive Embedded'],
    industryConnections: ['Automotive OEMs', 'Industrial automation', 'Consumer electronics', 'Medical devices'],
    requiredSkills: ['C programming', 'Microcontrollers', 'Electronics basics', 'Networking'],
    relatedCourses: ['Embedded Systems', 'Computer Architecture', 'Operating Systems', 'Computer Networks'],
    equipment: ['ARM Cortex Development Boards', 'STM32 Nucleo', 'ESP32', 'Logic Analyzers', 'Power Profilers'],
    capacity: 35,
    location: 'Engineering Building, Room 102'
  },
  {
    id: 'lab-power',
    name: 'Power Electronics Laboratory',
    shortName: 'Power Lab',
    description: 'High-power testing facility for power converters, motor drives, and renewable energy systems.',
    purpose: 'Design and test power electronic systems for EVs, renewable energy, and industrial drives.',
    projects: [
      {
        id: 'proj-inverter',
        name: 'Grid-Tied Solar Inverter',
        description: 'Design a single-phase grid-connected inverter with MPPT for solar applications.',
        difficulty: 'advanced',
        technologies: ['MATLAB/Simulink', 'C', 'dSPACE', 'Power Electronics'],
        duration: '4 months',
        outcomes: ['Power converter design', 'Control implementation', 'Grid synchronization']
      },
      {
        id: 'proj-bldc',
        name: 'BLDC Motor Controller',
        description: 'Implement field-oriented control for brushless DC motors used in EVs.',
        difficulty: 'intermediate',
        technologies: ['TI C2000', 'MATLAB', 'Power Stage', 'Encoder'],
        duration: '10 weeks',
        outcomes: ['Motor control', 'Power stage design', 'Embedded implementation']
      }
    ],
    researchAreas: ['Electric Vehicles', 'Renewable Energy', 'Wide-Bandgap Semiconductors', 'Wireless Power'],
    industryConnections: ['EV manufacturers', 'Power semiconductor companies', 'Renewable energy', 'Grid operators'],
    requiredSkills: ['Circuit analysis', 'Control systems', 'Electronics', 'MATLAB/Simulink'],
    relatedCourses: ['Power Electronics', 'Control Systems', 'Electric Machines', 'Renewable Energy'],
    equipment: ['Power Analyzers', 'High-Voltage Supplies', 'Motor Dynamometers', 'dSPACE Controllers'],
    capacity: 20,
    location: 'Engineering Building, Room 103'
  }
]

// ============================================
// Specializations Data
// ============================================
export const specializations: Specialization[] = [
  {
    id: 'spec-ai-hardware',
    name: 'AI Hardware Engineering',
    description: 'Design specialized hardware for AI acceleration, from custom ASICs to FPGA-based solutions.',
    careerPaths: ['AI Chip Designer', 'ML Hardware Engineer', 'FPGA Developer', 'Hardware Architect'],
    requiredCourses: ['VLSI Design', 'Computer Architecture', 'Machine Learning', 'Digital Design'],
    electiveCourses: ['Deep Learning', 'High-Level Synthesis', 'Hardware Security', 'Advanced VLSI'],
    skillsGained: ['RTL Design', 'AI Model Optimization', 'FPGA Development', 'Hardware-Software Co-design'],
    industryDemand: 'high',
    avgSalary: '$150,000 - $220,000',
    companies: ['NVIDIA', 'AMD', 'Intel', 'Google', 'Apple', 'Cerebras', 'Graphcore'],
    labConnections: ['lab-vlsi', 'lab-ai']
  },
  {
    id: 'spec-robotics',
    name: 'Robotics & Autonomous Systems',
    description: 'Build intelligent robotic systems capable of perception, decision-making, and autonomous operation.',
    careerPaths: ['Robotics Engineer', 'Autonomy Developer', 'Motion Planning Specialist', 'Perception Engineer'],
    requiredCourses: ['Control Systems', 'Robotics', 'Machine Learning', 'Embedded Systems'],
    electiveCourses: ['Computer Vision', 'SLAM', 'Reinforcement Learning', 'Sensor Fusion'],
    skillsGained: ['ROS2', 'Motion Planning', 'Sensor Integration', 'Real-time Systems'],
    industryDemand: 'high',
    avgSalary: '$130,000 - $180,000',
    companies: ['Boston Dynamics', 'Tesla', 'Waymo', 'Amazon Robotics', 'Intuitive Surgical'],
    labConnections: ['lab-robotics', 'lab-ai', 'lab-embedded']
  },
  {
    id: 'spec-wireless',
    name: 'Wireless Communications',
    description: 'Design next-generation wireless systems for 5G/6G, satellite, and IoT communications.',
    careerPaths: ['RF Engineer', 'Wireless Systems Engineer', 'Protocol Developer', 'Antenna Designer'],
    requiredCourses: ['Communication Systems', 'Digital Signal Processing', 'Electromagnetic Theory', 'Random Processes'],
    electiveCourses: ['Antenna Design', 'MIMO Systems', 'Software-Defined Radio', 'Information Theory'],
    skillsGained: ['RF Design', 'PHY/MAC Protocols', 'Spectrum Analysis', 'System Simulation'],
    industryDemand: 'high',
    avgSalary: '$120,000 - $170,000',
    companies: ['Qualcomm', 'Ericsson', 'Nokia', 'Samsung', 'Apple', 'SpaceX'],
    labConnections: ['lab-signal']
  },
  {
    id: 'spec-ml',
    name: 'Machine Learning Engineering',
    description: 'Build and deploy production ML systems for real-world applications at scale.',
    careerPaths: ['ML Engineer', 'AI Research Engineer', 'Data Scientist', 'MLOps Engineer'],
    requiredCourses: ['Machine Learning', 'Deep Learning', 'Data Structures', 'Statistics'],
    electiveCourses: ['NLP', 'Computer Vision', 'Reinforcement Learning', 'Distributed Systems'],
    skillsGained: ['PyTorch/TensorFlow', 'Model Deployment', 'MLOps', 'Experimentation'],
    industryDemand: 'high',
    avgSalary: '$140,000 - $200,000',
    companies: ['Google', 'Meta', 'OpenAI', 'Anthropic', 'Microsoft', 'Amazon'],
    labConnections: ['lab-ai']
  },
  {
    id: 'spec-embedded',
    name: 'Embedded Systems & IoT',
    description: 'Design resource-constrained systems for automotive, industrial, and consumer applications.',
    careerPaths: ['Embedded Engineer', 'Firmware Developer', 'IoT Architect', 'Automotive Software Engineer'],
    requiredCourses: ['Embedded Systems', 'Computer Architecture', 'Operating Systems', 'Computer Networks'],
    electiveCourses: ['RTOS', 'Automotive Systems', 'Hardware Security', 'Low-Power Design'],
    skillsGained: ['C/C++', 'RTOS', 'Hardware Interfaces', 'Debugging Tools'],
    industryDemand: 'high',
    avgSalary: '$110,000 - $160,000',
    companies: ['Tesla', 'Apple', 'Qualcomm', 'NXP', 'Texas Instruments', 'Bosch'],
    labConnections: ['lab-embedded', 'lab-vlsi']
  },
  {
    id: 'spec-power',
    name: 'Power Electronics & Energy',
    description: 'Design power conversion systems for EVs, renewable energy, and grid applications.',
    careerPaths: ['Power Electronics Engineer', 'EV Powertrain Engineer', 'Grid Integration Specialist'],
    requiredCourses: ['Power Electronics', 'Control Systems', 'Electric Machines', 'Circuit Analysis'],
    electiveCourses: ['EV Systems', 'Renewable Energy', 'Power Systems', 'Wide-Bandgap Devices'],
    skillsGained: ['Converter Design', 'Motor Control', 'Simulation', 'Hardware Testing'],
    industryDemand: 'high',
    avgSalary: '$115,000 - $165,000',
    companies: ['Tesla', 'Rivian', 'Lucid', 'ABB', 'Siemens', 'GE'],
    labConnections: ['lab-power']
  }
]

// ============================================
// Courses Data
// ============================================
export const courses: Course[] = [
  {
    id: 'course-signals',
    code: 'ECE301',
    name: 'Signals and Systems',
    description: 'Fundamental analysis of continuous and discrete-time signals and linear time-invariant systems.',
    credits: 4,
    semester: 3,
    prerequisites: ['ECE201', 'MATH201'],
    topics: [
      { id: 'topic-fourier', name: 'Fourier Transform', description: 'Frequency domain analysis of signals', lectureIds: [], assessmentIds: [] },
      { id: 'topic-laplace', name: 'Laplace Transform', description: 'S-domain analysis for system characterization', lectureIds: [], assessmentIds: [] },
      { id: 'topic-convolution', name: 'Convolution', description: 'System response computation', lectureIds: [], assessmentIds: [] },
      { id: 'topic-sampling', name: 'Sampling Theory', description: 'Nyquist theorem and aliasing', lectureIds: [], assessmentIds: [] }
    ],
    labConnections: ['lab-signal'],
    schedule: { dayOfWeek: 1, startTime: '09:00', endTime: '10:30', room: 'ENG 201', type: 'lecture' }
  },
  {
    id: 'course-vlsi',
    code: 'ECE401',
    name: 'VLSI Design',
    description: 'Design of digital integrated circuits from transistor level to system architecture.',
    credits: 4,
    semester: 5,
    prerequisites: ['ECE301', 'ECE302'],
    topics: [
      { id: 'topic-cmos', name: 'CMOS Logic Design', description: 'Transistor-level digital design', lectureIds: [], assessmentIds: [] },
      { id: 'topic-timing', name: 'Timing Analysis', description: 'Setup, hold, and critical path analysis', lectureIds: [], assessmentIds: [] },
      { id: 'topic-synthesis', name: 'Logic Synthesis', description: 'RTL to gate-level transformation', lectureIds: [], assessmentIds: [] },
      { id: 'topic-verification', name: 'Verification', description: 'Functional and formal verification', lectureIds: [], assessmentIds: [] }
    ],
    labConnections: ['lab-vlsi'],
    schedule: { dayOfWeek: 2, startTime: '14:00', endTime: '15:30', room: 'ENG 401', type: 'lecture' }
  },
  {
    id: 'course-ml',
    code: 'CS421',
    name: 'Machine Learning',
    description: 'Fundamentals of machine learning algorithms, theory, and practical applications.',
    credits: 4,
    semester: 5,
    prerequisites: ['CS301', 'MATH301', 'STAT301'],
    topics: [
      { id: 'topic-supervised', name: 'Supervised Learning', description: 'Classification and regression methods', lectureIds: [], assessmentIds: [] },
      { id: 'topic-unsupervised', name: 'Unsupervised Learning', description: 'Clustering and dimensionality reduction', lectureIds: [], assessmentIds: [] },
      { id: 'topic-neural', name: 'Neural Networks', description: 'Deep learning fundamentals', lectureIds: [], assessmentIds: [] },
      { id: 'topic-optimization', name: 'Optimization', description: 'Gradient descent and beyond', lectureIds: [], assessmentIds: [] }
    ],
    labConnections: ['lab-ai'],
    schedule: { dayOfWeek: 3, startTime: '11:00', endTime: '12:30', room: 'CS 501', type: 'lecture' }
  },
  {
    id: 'course-control',
    code: 'ECE350',
    name: 'Control Systems',
    description: 'Analysis and design of feedback control systems using classical and modern techniques.',
    credits: 4,
    semester: 4,
    prerequisites: ['ECE301', 'MATH301'],
    topics: [
      { id: 'topic-feedback', name: 'Feedback Control', description: 'Closed-loop system analysis', lectureIds: [], assessmentIds: [] },
      { id: 'topic-stability', name: 'Stability Analysis', description: 'Routh-Hurwitz and Nyquist criteria', lectureIds: [], assessmentIds: [] },
      { id: 'topic-pid', name: 'PID Control', description: 'Industrial controller design', lectureIds: [], assessmentIds: [] },
      { id: 'topic-statespace', name: 'State-Space Methods', description: 'Modern control theory', lectureIds: [], assessmentIds: [] }
    ],
    labConnections: ['lab-robotics', 'lab-power'],
    schedule: { dayOfWeek: 4, startTime: '09:00', endTime: '10:30', room: 'ENG 301', type: 'lecture' }
  },
  {
    id: 'course-embedded',
    code: 'ECE380',
    name: 'Embedded Systems',
    description: 'Design of microcontroller-based systems for real-world applications.',
    credits: 4,
    semester: 5,
    prerequisites: ['ECE280', 'CS201'],
    topics: [
      { id: 'topic-arch', name: 'Microcontroller Architecture', description: 'ARM Cortex-M internals', lectureIds: [], assessmentIds: [] },
      { id: 'topic-peripherals', name: 'Peripheral Interfaces', description: 'GPIO, UART, SPI, I2C', lectureIds: [], assessmentIds: [] },
      { id: 'topic-interrupts', name: 'Interrupts & Timers', description: 'Event-driven programming', lectureIds: [], assessmentIds: [] },
      { id: 'topic-rtos', name: 'RTOS Concepts', description: 'Task scheduling and synchronization', lectureIds: [], assessmentIds: [] }
    ],
    labConnections: ['lab-embedded'],
    schedule: { dayOfWeek: 5, startTime: '14:00', endTime: '15:30', room: 'ENG 102', type: 'lecture' }
  }
]

// ============================================
// Context Cards Data
// ============================================
export const contextCards: ContextCard[] = [
  {
    id: 'cc-fourier',
    topicId: 'topic-fourier',
    topicName: 'Fourier Transform',
    whyItExists: 'The Fourier Transform exists to decompose complex signals into their constituent frequencies, revealing information hidden in the time domain. This is fundamental because many physical systems respond differently to different frequencies, and understanding frequency content enables filtering, compression, and analysis.',
    industryApplications: [
      {
        industry: 'Telecommunications',
        useCase: 'Signal modulation and demodulation in wireless systems',
        realWorldExample: '5G base stations use FFT to convert between time and frequency domains for OFDM transmission, processing millions of subcarriers per second.',
        companies: ['Qualcomm', 'Ericsson', 'Nokia']
      },
      {
        industry: 'Medical Imaging',
        useCase: 'MRI image reconstruction from k-space data',
        realWorldExample: 'MRI machines acquire data in the frequency domain (k-space) and use 2D inverse FFT to reconstruct anatomical images with sub-millimeter resolution.',
        companies: ['Siemens Healthineers', 'GE Healthcare', 'Philips']
      },
      {
        industry: 'Audio Processing',
        useCase: 'Spectral analysis and noise reduction',
        realWorldExample: 'Noise-canceling headphones like AirPods Pro analyze audio spectrum in real-time to generate anti-noise signals, updating 200 times per second.',
        companies: ['Apple', 'Bose', 'Sony']
      }
    ],
    labConnection: {
      labId: 'lab-signal',
      labName: 'Signal Processing Laboratory',
      experimentName: 'Spectrum Analysis of Audio Signals',
      experimentDescription: 'Analyze the frequency content of various audio signals using FFT, observe the effect of windowing, and implement basic frequency-domain filters.',
      equipmentUsed: ['MATLAB', 'Spectrum Analyzer', 'Function Generator']
    },
    companiesHiring: [
      { name: 'Qualcomm', sector: 'Semiconductors', rolesHiring: ['DSP Engineer', 'Modem Systems Engineer'], salaryRange: '$130K-$180K' },
      { name: 'Apple', sector: 'Consumer Electronics', rolesHiring: ['Audio DSP Engineer', 'Signal Processing Engineer'], salaryRange: '$150K-$220K' },
      { name: 'SpaceX', sector: 'Aerospace', rolesHiring: ['RF Systems Engineer', 'Communications Engineer'], salaryRange: '$120K-$170K' }
    ],
    relatedTopics: ['Laplace Transform', 'Z-Transform', 'Sampling Theory', 'Convolution'],
    workedExample: {
      problem: 'A 1 kHz sine wave is sampled at 8 kHz. Calculate the DFT bin index where the signal peak appears for a 256-point FFT.',
      solution: 'Bin index = (signal frequency / sampling rate) × FFT size = (1000 / 8000) × 256 = 32. The peak appears at bin 32 (and its mirror at bin 224).',
      realParameters: {
        'Signal Frequency': '1 kHz',
        'Sampling Rate': '8 kHz (typical telephony)',
        'FFT Size': '256 points'
      },
      industryContext: 'This exact calculation is used in voice codecs like G.711 for VOIP systems to identify speech formants.'
    },
    confidence: 0.95,
    generatedAt: new Date('2024-01-15')
  },
  {
    id: 'cc-pid',
    topicId: 'topic-pid',
    topicName: 'PID Control',
    whyItExists: 'PID (Proportional-Integral-Derivative) control exists to automatically regulate a process variable to match a desired setpoint. It combines three control actions: proportional responds to current error, integral eliminates steady-state error, and derivative anticipates future error based on rate of change.',
    industryApplications: [
      {
        industry: 'Automotive',
        useCase: 'Cruise control and engine management',
        realWorldExample: 'Tesla vehicles use cascaded PID loops for regenerative braking, adjusting motor torque hundreds of times per second to maintain target deceleration.',
        companies: ['Tesla', 'BMW', 'Toyota']
      },
      {
        industry: 'Process Industries',
        useCase: 'Temperature and pressure regulation',
        realWorldExample: 'Oil refineries use thousands of PID controllers to maintain precise temperature profiles in distillation columns within 0.5°C tolerance.',
        companies: ['Honeywell', 'Emerson', 'ABB']
      },
      {
        industry: 'Robotics',
        useCase: 'Joint position and velocity control',
        realWorldExample: 'Industrial robots like KUKA arms use PID control at each joint to achieve positioning accuracy of 0.03mm for precision assembly tasks.',
        companies: ['KUKA', 'Fanuc', 'ABB Robotics']
      }
    ],
    labConnection: {
      labId: 'lab-robotics',
      labName: 'Robotics & Automation Laboratory',
      experimentName: 'Ball and Beam PID Control',
      experimentDescription: 'Implement PID control to balance a ball on a tilting beam, tuning gains for optimal response while minimizing overshoot and settling time.',
      equipmentUsed: ['Ball-Beam Setup', 'Arduino', 'Position Sensor', 'Servo Motor']
    },
    companiesHiring: [
      { name: 'Tesla', sector: 'Automotive', rolesHiring: ['Control Systems Engineer', 'Autopilot Engineer'], salaryRange: '$140K-$200K' },
      { name: 'Boston Dynamics', sector: 'Robotics', rolesHiring: ['Controls Engineer', 'Motion Planning Engineer'], salaryRange: '$130K-$180K' },
      { name: 'Honeywell', sector: 'Industrial Automation', rolesHiring: ['Process Control Engineer', 'Systems Engineer'], salaryRange: '$100K-$150K' }
    ],
    relatedTopics: ['Feedback Control', 'Stability Analysis', 'State-Space Methods', 'Digital Control'],
    workedExample: {
      problem: 'Design a PID controller for a DC motor with transfer function G(s) = 10/(s+5) to achieve zero steady-state error for a step input.',
      solution: 'Using Ziegler-Nichols tuning: Kp = 2.5, Ki = 5.0, Kd = 0.3. The integral term ensures zero steady-state error. Verify stability using root locus or Bode plot.',
      realParameters: {
        'Motor Time Constant': '200 ms',
        'DC Gain': '10',
        'Control Update Rate': '1 kHz'
      },
      industryContext: 'Similar parameters are used in drone flight controllers for attitude stabilization.'
    },
    confidence: 0.92,
    generatedAt: new Date('2024-01-15')
  }
]

// ============================================
// Badges Data
// ============================================
export const badges: Badge[] = [
  { id: 'badge-explorer', name: 'Lab Explorer', description: 'Visited all campus labs during Discovery Week', icon: 'compass', category: 'exploration', rarity: 'common', requirement: 6 },
  { id: 'badge-curious', name: 'Curious Mind', description: 'Completed 10 context cards', icon: 'lightbulb', category: 'exploration', rarity: 'common', requirement: 10 },
  { id: 'badge-streak-7', name: 'Week Warrior', description: 'Maintained a 7-day learning streak', icon: 'flame', category: 'streak', rarity: 'common', requirement: 7 },
  { id: 'badge-streak-30', name: 'Month Master', description: 'Maintained a 30-day learning streak', icon: 'flame', category: 'streak', rarity: 'rare', requirement: 30 },
  { id: 'badge-perfect', name: 'Perfectionist', description: 'Scored 100% on any assessment', icon: 'star', category: 'achievement', rarity: 'rare', requirement: 1 },
  { id: 'badge-master-topic', name: 'Topic Master', description: 'Achieved 90%+ mastery on 5 topics', icon: 'crown', category: 'mastery', rarity: 'epic', requirement: 5 },
  { id: 'badge-helper', name: 'Knowledge Sharer', description: 'Helped 10 peers with explanations', icon: 'users', category: 'community', rarity: 'rare', requirement: 10 },
  { id: 'badge-early', name: 'Early Bird', description: 'Completed assignments before deadline 10 times', icon: 'clock', category: 'achievement', rarity: 'common', requirement: 10 },
  { id: 'badge-project', name: 'Project Pioneer', description: 'Completed first lab project', icon: 'rocket', category: 'achievement', rarity: 'common', requirement: 1 },
  { id: 'badge-multilingual', name: 'Polyglot Learner', description: 'Used content in 3 different languages', icon: 'globe', category: 'exploration', rarity: 'rare', requirement: 3 }
]

// ============================================
// Sample Student Profile
// ============================================
export const sampleStudent: StudentProfile = {
  id: 'student-1',
  email: 'alex.chen@university.edu',
  name: 'Alex Chen',
  role: 'student',
  avatar: '/avatars/alex.jpg',
  department: 'Electrical & Computer Engineering',
  enrollmentYear: 2023,
  specialization: 'AI Hardware Engineering',
  currentSemester: 4,
  xp: 2450,
  level: 8,
  streak: 12,
  completedCourses: ['ECE201', 'ECE202', 'MATH201', 'CS201'],
  badges: [
    { ...badges[0], unlockedAt: new Date('2024-01-10') },
    { ...badges[2], unlockedAt: new Date('2024-02-01') },
    { ...badges[7], unlockedAt: new Date('2024-02-15') }
  ],
  weakTopics: ['Laplace Transform', 'State-Space Methods'],
  strongTopics: ['Fourier Transform', 'CMOS Logic Design', 'Neural Networks'],
  createdAt: new Date('2023-08-15')
}

// ============================================
// Sample Learning Roadmap
// ============================================
export const sampleRoadmap: LearningRoadmap = {
  id: 'roadmap-1',
  studentId: 'student-1',
  specializationId: 'spec-ai-hardware',
  currentSemester: 4,
  progress: 45,
  lastUpdated: new Date('2024-02-20'),
  semesters: [
    {
      semester: 3,
      status: 'completed',
      totalCredits: 18,
      workloadIntensity: 'moderate',
      courses: [
        { courseId: 'course-signals', courseName: 'Signals and Systems', courseCode: 'ECE301', credits: 4, relevanceTags: ['Foundation', 'DSP'], status: 'completed', grade: 'A', masteryLevel: 85 },
        { courseId: 'course-data', courseName: 'Data Structures', courseCode: 'CS201', credits: 4, relevanceTags: ['Programming', 'Foundation'], status: 'completed', grade: 'A-', masteryLevel: 80 }
      ],
      selfStudyTargets: []
    },
    {
      semester: 4,
      status: 'current',
      totalCredits: 17,
      workloadIntensity: 'heavy',
      courses: [
        { courseId: 'course-control', courseName: 'Control Systems', courseCode: 'ECE350', credits: 4, relevanceTags: ['Foundation', 'Hardware'], status: 'in-progress', masteryLevel: 65 },
        { courseId: 'course-arch', courseName: 'Computer Architecture', courseCode: 'ECE320', credits: 4, relevanceTags: ['Hardware', 'AI Hardware'], status: 'in-progress', masteryLevel: 70 }
      ],
      selfStudyTargets: [
        { id: 'self-1', name: 'Verilog Fundamentals', description: 'Learn HDL basics before VLSI course', estimatedHours: 20, completed: true, resources: [{ type: 'course', title: 'HDL Bits', provider: 'HDLBits', url: 'https://hdlbits.01xz.net' }] },
        { id: 'self-2', name: 'PyTorch Basics', description: 'Prepare for ML course', estimatedHours: 15, completed: false, resources: [{ type: 'tutorial', title: 'PyTorch Tutorials', provider: 'PyTorch', url: 'https://pytorch.org/tutorials' }] }
      ]
    },
    {
      semester: 5,
      status: 'upcoming',
      totalCredits: 18,
      workloadIntensity: 'heavy',
      courses: [
        { courseId: 'course-vlsi', courseName: 'VLSI Design', courseCode: 'ECE401', credits: 4, relevanceTags: ['Core', 'AI Hardware'], status: 'planned' },
        { courseId: 'course-ml', courseName: 'Machine Learning', courseCode: 'CS421', credits: 4, relevanceTags: ['Core', 'AI'], status: 'planned' },
        { courseId: 'course-embedded', courseName: 'Embedded Systems', courseCode: 'ECE380', credits: 4, relevanceTags: ['Hardware', 'Systems'], status: 'planned' }
      ],
      selfStudyTargets: [
        { id: 'self-3', name: 'FPGA Development', description: 'Xilinx Vivado workflow', estimatedHours: 25, completed: false, resources: [{ type: 'course', title: 'FPGA Design for Embedded Systems', provider: 'Coursera', url: 'https://coursera.org' }] }
      ]
    },
    {
      semester: 6,
      status: 'upcoming',
      totalCredits: 16,
      workloadIntensity: 'moderate',
      courses: [
        { courseId: 'course-dl', courseName: 'Deep Learning', courseCode: 'CS422', credits: 4, relevanceTags: ['AI', 'Core'], status: 'planned' },
        { courseId: 'course-hls', courseName: 'High-Level Synthesis', courseCode: 'ECE450', credits: 3, relevanceTags: ['AI Hardware', 'Advanced'], status: 'planned' }
      ],
      selfStudyTargets: []
    }
  ],
  milestones: [
    { id: 'mile-1', type: 'project', name: 'RISC-V Implementation', description: 'Complete 5-stage pipelined processor', targetSemester: 5, status: 'planned' },
    { id: 'mile-2', type: 'internship', name: 'Summer Internship', description: 'Hardware engineering internship at semiconductor company', targetSemester: 6, status: 'planned' },
    { id: 'mile-3', type: 'certification', name: 'NVIDIA DLI Certification', description: 'Deep Learning for Autonomous Vehicles', targetSemester: 6, status: 'planned' }
  ]
}

// ============================================
// Sample Assessment
// ============================================
export const sampleAssessment: Assessment = {
  id: 'assess-1',
  topicId: 'topic-fourier',
  topicName: 'Fourier Transform',
  type: 'micro-test',
  difficulty: 3,
  timeLimit: 15,
  createdAt: new Date('2024-02-20'),
  questions: [
    {
      id: 'q1',
      type: 'mcq',
      text: 'The Fourier Transform of a real-valued, even-symmetric signal is:',
      options: ['Purely real', 'Purely imaginary', 'Complex with zero real part', 'Always zero'],
      correctAnswer: 'Purely real',
      explanation: 'Even-symmetric real signals have Fourier Transforms that are purely real because the imaginary components cancel out due to symmetry.',
      bloomLevel: 3,
      points: 10,
      remediationLink: '/context/fourier-properties'
    },
    {
      id: 'q2',
      type: 'numerical',
      text: 'A signal sampled at 10 kHz is analyzed using a 1024-point FFT. What is the frequency resolution in Hz?',
      correctAnswer: 9.77,
      explanation: 'Frequency resolution = Sampling Rate / FFT Size = 10000 / 1024 ≈ 9.77 Hz',
      bloomLevel: 3,
      points: 15,
      remediationLink: '/context/fft-resolution'
    },
    {
      id: 'q3',
      type: 'mcq',
      text: 'In OFDM systems used in 5G, why is the FFT/IFFT pair essential?',
      options: [
        'To reduce transmission power',
        'To convert between time and frequency domain for efficient subcarrier modulation',
        'To encrypt the signal',
        'To reduce antenna size'
      ],
      correctAnswer: 'To convert between time and frequency domain for efficient subcarrier modulation',
      explanation: 'OFDM uses IFFT at the transmitter to combine multiple frequency subcarriers into a time-domain signal, and FFT at the receiver to separate them.',
      bloomLevel: 4,
      points: 15,
      remediationLink: '/context/fourier-ofdm'
    }
  ]
}

// ============================================
// Sample Lectures
// ============================================
export const sampleLectures: Lecture[] = [
  {
    id: 'lecture-1',
    courseId: 'course-signals',
    topicId: 'topic-fourier',
    title: 'Introduction to Fourier Transform',
    date: new Date('2024-02-19'),
    status: 'completed',
    materials: [
      { type: 'slides', url: '/materials/fourier-intro.pdf', name: 'Lecture Slides', uploadedAt: new Date('2024-02-19') },
      { type: 'video', url: '/materials/fourier-intro.mp4', name: 'Lecture Recording', uploadedAt: new Date('2024-02-19') }
    ],
    companion: {
      id: 'comp-1',
      lectureId: 'lecture-1',
      summary: 'This lecture introduced the Fourier Transform as a powerful tool for frequency-domain analysis. We covered the mathematical definition, intuition behind decomposing signals into sinusoids, and the relationship between time and frequency representations.',
      keyConcepts: [
        { name: 'Fourier Transform Definition', explanation: 'X(f) = ∫x(t)e^(-j2πft)dt - Decomposes signal into frequency components', formula: 'X(f) = ∫_{-∞}^{∞} x(t)e^{-j2πft}dt', importance: 'critical' },
        { name: 'Frequency Resolution', explanation: 'The ability to distinguish between nearby frequencies depends on signal duration', importance: 'important' },
        { name: 'Parseval\'s Theorem', explanation: 'Energy is preserved between time and frequency domains', formula: '∫|x(t)|²dt = ∫|X(f)|²df', importance: 'important' }
      ],
      realWorldApplications: [
        'Audio equalizers separate music into frequency bands using FFT',
        'Medical ultrasound uses Fourier techniques for image formation',
        'Vibration analysis in machinery detects faults by frequency signatures'
      ],
      labConnections: ['Signal Processing Lab - Spectrum Analysis experiment'],
      catchUpPackage: {
        missedContent: 'Introduction to Fourier Transform concepts and mathematical foundations',
        keyFormulas: ['X(f) = ∫x(t)e^(-j2πft)dt', 'x(t) = ∫X(f)e^(j2πft)df'],
        applicationExamples: ['Analyze audio file spectrum', 'Identify dominant frequencies in ECG signal'],
        homeworkGuidance: 'Focus on problems 3.1-3.5 which cover basic transform computation and property verification',
        estimatedCatchUpTime: 45
      },
      relatedTopics: ['Laplace Transform', 'Z-Transform', 'DFT/FFT'],
      translations: {},
      generatedAt: new Date('2024-02-19')
    }
  }
]

// ============================================
// Sample Professors
// ============================================
export const professors: ProfessorProfile[] = [
  {
    id: 'prof-1',
    email: 'dr.kumar@university.edu',
    name: 'Dr. Ananya Kumar',
    role: 'professor',
    department: 'Electrical & Computer Engineering',
    courses: ['ECE301', 'ECE401'],
    expertise: ['VLSI Design', 'Signal Processing', 'AI Hardware'],
    rating: 4.8,
    createdAt: new Date('2020-01-15')
  },
  {
    id: 'prof-2',
    email: 'dr.zhang@university.edu',
    name: 'Dr. Wei Zhang',
    role: 'professor',
    department: 'Computer Science',
    courses: ['CS421', 'CS422'],
    expertise: ['Machine Learning', 'Deep Learning', 'Computer Vision'],
    rating: 4.7,
    createdAt: new Date('2019-08-01')
  },
  {
    id: 'prof-3',
    email: 'dr.patel@university.edu',
    name: 'Dr. Raj Patel',
    role: 'professor',
    department: 'Electrical & Computer Engineering',
    courses: ['ECE350', 'ECE380'],
    expertise: ['Control Systems', 'Robotics', 'Embedded Systems'],
    rating: 4.6,
    createdAt: new Date('2018-01-10')
  }
]

// ============================================
// Sample Feedback
// ============================================
export const sampleFeedback: Feedback[] = [
  {
    id: 'fb-1',
    studentId: 'anonymous',
    courseId: 'course-signals',
    type: 'teaching',
    content: 'The lectures are well-structured but could use more practical examples connecting to industry applications.',
    sentiment: 'neutral',
    urgency: 'low',
    category: 'Course Content',
    actionable: true,
    status: 'pending',
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'fb-2',
    studentId: 'anonymous',
    type: 'lab',
    content: 'The VLSI lab computers are outdated and simulation tools run very slowly. This affects our productivity significantly.',
    sentiment: 'negative',
    urgency: 'high',
    category: 'Infrastructure',
    actionable: true,
    status: 'reviewed',
    createdAt: new Date('2024-02-10')
  }
]

// ============================================
// Sample Hardware Requests
// ============================================
export const hardwareRequests: HardwareRequest[] = [
  {
    id: 'hw-1',
    studentId: 'student-1',
    equipmentName: 'NVIDIA Jetson Orin',
    description: 'Edge AI development kit for deploying neural networks',
    justification: 'Essential for AI Hardware specialization projects, currently no edge AI platforms available in lab',
    estimatedBeneficiaries: 25,
    relevantCourses: ['CS421', 'ECE401'],
    estimatedCost: 1999,
    status: 'pending',
    aiEvaluation: {
      benefitScore: 85,
      relevanceScore: 92,
      costEffectivenessScore: 78,
      recommendation: 'approve',
      reasoning: 'High alignment with AI Hardware specialization track. Benefits 25+ students across 2 core courses. Cost is justified by multi-year usability and industry relevance.'
    },
    createdAt: new Date('2024-02-18')
  }
]

// ============================================
// Helper Functions
// ============================================
export function getLabById(id: string): Lab | undefined {
  return labs.find(lab => lab.id === id)
}

export function getSpecializationById(id: string): Specialization | undefined {
  return specializations.find(spec => spec.id === id)
}

export function getCourseById(id: string): Course | undefined {
  return courses.find(course => course.id === id)
}

export function getContextCardByTopicId(topicId: string): ContextCard | undefined {
  return contextCards.find(card => card.topicId === topicId)
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

export function xpForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100
}

export function xpProgress(xp: number, level: number): number {
  const currentLevelXp = Math.pow(level - 1, 2) * 100
  const nextLevelXp = Math.pow(level, 2) * 100
  return ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
}
