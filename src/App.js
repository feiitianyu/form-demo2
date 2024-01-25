import { useState, useEffect, useRef } from 'react'
import { Menu } from 'antd'
import { PoundOutlined, PayCircleOutlined } from '@ant-design/icons';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import '@bpmn-io/form-js/dist/assets/form-js.css'
import '@bpmn-io/form-js/dist/assets/form-js-editor.css'
import '@bpmn-io/form-js/dist/assets/form-js-playground.css'
import { FormPlayground } from '@bpmn-io/form-js'
import { xmlstr } from './diagram.js'
import './App.css';
import schema from './form.json'
import FeedbackButtonRenderExtension from './extension/render';
import FeedbackButtonPropertiesPanelExtension from './extension/propertiesPanel';
import zeebeModdle from 'zeebe-bpmn-moddle/resources/zeebe';
import ZeebeBehaviorsModule from 'camunda-bpmn-js-behaviors/lib/camunda-cloud';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  ZeebePropertiesProviderModule
} from 'bpmn-js-properties-panel';

function App() {
  const [current, setCurrent] = useState('form')
  const bpmnModelerRef = useRef()
  const formPlaygroundRef = useRef()

  const createBpmnDiagram = async () => {
    try {
      if (!bpmnModelerRef.current) return
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
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        // 左边工具栏以及节点
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        ZeebePropertiesProviderModule,
        ZeebeBehaviorsModule
      ],
      moddleExtensions: {
        zeebe: zeebeModdle
      }
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

  const save = () => {
    if (bpmnModelerRef.current) {
      bpmnModelerRef.current.saveXML().then((xml) => console.log(xml));
    }
  }

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
      <div className='cus-form-container' style={{ display: current === 'form' ? 'block' : 'none', height: 'calc(100vh - 104px)', overflowY: 'auto', padding: '12px 0' }}>
        <div id='form-canvas' style={{ width: '100%', height: '100%' }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div id='flow-canvas' className='cus-flow-container' style={{ display: current === 'flow' ? 'block' : 'none', width: '80%' }}>
        </div>
        <div id="js-properties-panel" className="panel" style={{ width: '20%', borderLeft: '1px solid #efefef', display: current === 'flow' ? '' : 'none' }}></div>
        {current === 'flow' && <button onClick={() => save()} style={{ position: 'absolute', bottom: 10, left: 10 }}>保存为xml</button>}
      </div>
    </div>
  );
}

export default App;
