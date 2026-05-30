/**
 * components/discovery/Section1SystemInventory.jsx
 * 
 * Section 1: System Inventory
 * 
 * Collects:
 * - EHR/CRM systems in use
 * - Data warehouses and databases
 * - Cloud providers
 * - Message queues and async systems
 * - Number of custom applications
 */

import React from 'react';
import { useDiscoveryStore } from '../../store/discoveryStore';
import Card from '../common/Card';
import Input from '../common/Input';
import Badge from '../common/Badge';
import '../../styles/discovery.css';

export default function Section1SystemInventory() {
  const { discovery, updateNestedField, validationErrors } = useDiscoveryStore();

  const COMMON_SYSTEMS = {
    ehr: [
      { id: 'epic', label: 'Epic' },
      { id: 'cerner', label: 'Cerner' },
      { id: 'allscripts', label: 'Allscripts' },
      { id: 'meditech', label: 'Meditech' },
      { id: 'athenahealth', label: 'athenaHealth' },
      { id: 'other', label: 'Other' },
    ],
    dw: [
      { id: 'snowflake', label: 'Snowflake' },
      { id: 'bigquery', label: 'Google BigQuery' },
      { id: 'redshift', label: 'Amazon Redshift' },
      { id: 'databricks', label: 'Databricks' },
      { id: 'teradata', label: 'Teradata' },
      { id: 'other', label: 'Other' },
    ],
    cloud: [
      { id: 'aws', label: 'Amazon AWS' },
      { id: 'gcp', label: 'Google Cloud Platform' },
      { id: 'azure', label: 'Microsoft Azure' },
      { id: 'oracle', label: 'Oracle Cloud' },
      { id: 'none', label: 'None' },
    ],
    mq: [
      { id: 'kafka', label: 'Apache Kafka' },
      { id: 'rabbitmq', label: 'RabbitMQ' },
      { id: 'sqs', label: 'AWS SQS' },
      { id: 'pubsub', label: 'Google Pub/Sub' },
      { id: 'none', label: 'None' },
    ],
  };

  const toggleSystem = (systemType, systemId) => {
    const fieldName = systemType === 'ehr' ? 'ehr_systems' : 
                      systemType === 'dw' ? 'data_warehouses' :
                      systemType === 'cloud' ? 'cloud_providers' :
                      'message_queues';

    const currentList = discovery.systems_in_use[fieldName] || [];
    const newList = currentList.includes(systemId)
      ? currentList.filter((id) => id !== systemId)
      : [...currentList, systemId];

    updateNestedField(`systems_in_use.${fieldName}`, newList);
  };

  return (
    <div className="discovery-section">
      <Card title="System Inventory" subtitle="What systems does your organization use?">
        {/* EHR Systems */}
        <div className="form-group">
          <label className="form-label">EHR/Healthcare Systems</label>
          <div className="checkbox-group">
            {COMMON_SYSTEMS.ehr.map((sys) => (
              <label key={sys.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.systems_in_use.ehr_systems?.includes(sys.id) || false}
                  onChange={() => toggleSystem('ehr', sys.id)}
                />
                <span>{sys.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Data Warehouses */}
        <div className="form-group">
          <label className="form-label">Data Warehouses</label>
          <div className="checkbox-group">
            {COMMON_SYSTEMS.dw.map((sys) => (
              <label key={sys.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.systems_in_use.data_warehouses?.includes(sys.id) || false}
                  onChange={() => toggleSystem('dw', sys.id)}
                />
                <span>{sys.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cloud Providers */}
        <div className="form-group">
          <label className="form-label">Cloud Providers</label>
          <div className="checkbox-group">
            {COMMON_SYSTEMS.cloud.map((sys) => (
              <label key={sys.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.systems_in_use.cloud_providers?.includes(sys.id) || false}
                  onChange={() => toggleSystem('cloud', sys.id)}
                />
                <span>{sys.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Message Queues */}
        <div className="form-group">
          <label className="form-label">Message Queues / Event Streaming</label>
          <div className="checkbox-group">
            {COMMON_SYSTEMS.mq.map((sys) => (
              <label key={sys.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={discovery.systems_in_use.message_queues?.includes(sys.id) || false}
                  onChange={() => toggleSystem('mq', sys.id)}
                />
                <span>{sys.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Applications */}
        <Input
          label="Number of Custom/Internal Applications"
          type="number"
          value={discovery.systems_in_use.custom_applications || 0}
          onChange={(e) =>
            updateNestedField('systems_in_use.custom_applications', parseInt(e.target.value) || 0)
          }
          placeholder="15"
          helperText="Applications developed internally by your organization"
        />

        {/* Summary */}
        <div className="system-summary">
          <h4>Systems Selected:</h4>
          <div className="badge-group">
            {discovery.systems_in_use.ehr_systems?.map((sys) => (
              <Badge key={sys} variant="info">
                {sys}
              </Badge>
            ))}
            {discovery.systems_in_use.data_warehouses?.map((sys) => (
              <Badge key={sys} variant="info">
                {sys}
              </Badge>
            ))}
            {discovery.systems_in_use.cloud_providers?.map((sys) => (
              <Badge key={sys} variant="info">
                {sys}
              </Badge>
            ))}
            {discovery.systems_in_use.custom_applications > 0 && (
              <Badge variant="info">
                {discovery.systems_in_use.custom_applications} custom apps
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
