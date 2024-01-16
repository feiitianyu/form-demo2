import { useState, useEffect, useRef } from 'react'
import { Segmented, Menu } from 'antd'
import { SettingOutlined, PoundOutlined, PayCircleOutlined } from '@ant-design/icons';
import bpmnJs from 'bpmn-js';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import '@bpmn-io/form-js/dist/assets/form-js.css'
import '@bpmn-io/form-js/dist/assets/form-js-editor.css'
import '@bpmn-io/form-js/dist/assets/form-js-playground.css'
// import propertiesPanelModule from 'bpmn-js-properties-panel';
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
// import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import { FormPlayground } from '@bpmn-io/form-js'
// import ReactBpmn from 'react-bpmn';
import { xmlstr } from './diagram.js'
import './App.css';
import schema from './form.json'
import FeedbackButtonRenderExtension from './extension/render';
import FeedbackButtonPropertiesPanelExtension from './extension/propertiesPanel';

function App() {
  const [current, setCurrent] = useState('form')
  const bpmnModelerRef = useRef()
  const formPlaygroundRef = useRef()

  const createBpmnDiagram = async () => {
    try {
      if(!bpmnModelerRef.current) return
      const res = await bpmnModelerRef.current.importXML(xmlstr)
      console.log('createBpmnDiagram_success', res)
    } catch (error) {
      console.log('createBpmnDiagram_failed', error)
    }
  }

  const initBpmn = () => {
    bpmnModelerRef.current = new BpmnModeler({
      container: '#flow-canvas',
      height: 'calc(100vh - 104px)',
      // propertiesPanel: {
      //   parent: '.properties-panel'
      // },
      // additionalModules: [
      //   // 左边工具栏以及节点
      //   propertiesPanelModule,
      //   propertiesProviderModule
      // ],
      // moddleExtensions: {
      //   camunda: camundaModdleDescriptor
      // }
    })
    createBpmnDiagram()
  }

  const initForm = () => {
    formPlaygroundRef.current = new FormPlayground({
      container: document.querySelector('#form-canvas'),
      height: '100%',
      // height: '100%',
      schema,
      data: {},
      additionalModules: [
        FeedbackButtonRenderExtension
      ],
      editorAdditionalModules: [
        FeedbackButtonPropertiesPanelExtension
      ]
    })
  }

  useEffect(() => {
    initBpmn()
  }, [])

  useEffect(() => {
    initForm()
  }, [])

  return (
    <div className="App">
      <div style={{ height: 56, borderBottom: '1px solid rgba(0, 0, 0, 0.1)', display: 'flex', padding: '8px 16px', alignItems: 'center' }}>流程表单</div>
      <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '8px 16px', boxShadow: '0 2px 3px 1px rgba(0, 0, 0, 0.05)', justifyContent: 'center' }}>
        <Menu
          mode='horizontal'
          items={[
            // { label: '基础设置', key: 'base', icon: <SettingOutlined /> },
            { label: '表单设计', key: 'form', icon: <PoundOutlined /> },
            { label: '流程设计', key: 'flow', icon: <PayCircleOutlined /> },
          ]}
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
        />
      </div>
      <div className='cus-form-container'  style={{ display: current === 'form' ? 'block' : 'none', height: 'calc(100vh - 104px)', overflowY: 'auto', padding: '12px 0' }}>
        <div id='form-canvas' style={{ width: '100%', height: '100%' }}></div>
      </div>
      <div id='flow-canvas' className='cus-flow-container' style={{ display: current === 'flow' ? 'block' : 'none' }}></div>
    </div>
  );
}

export default App;
