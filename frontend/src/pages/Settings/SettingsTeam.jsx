/**
 * pages/settings/SettingsTeam.jsx
 * 
 * Team management:
 * - List team members
 * - Invite new members
 * - Manage roles (Admin, Reviewer, Viewer)
 * - Remove members
 */

import React, { useEffect, useState } from 'react';
import { useAppStore } from '../../store/appStore';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import '../../styles/settings.css';

export default function SettingsTeam() {
  const { organization } = useAppStore();
  const [teamMembers, setTeamMembers] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('reviewer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch team members from API
    // Load mock data for now
    setTeamMembers([
      {
        id: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        invited_at: new Date().toISOString(),
        status: 'active',
      },
      {
        id: '2',
        email: 'reviewer@example.com',
        name: 'Reviewer',
        role: 'reviewer',
        invited_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'active',
      },
    ]);
  }, [organization?.id]);

  const handleInvite = async () => {
    if (!inviteEmail) {
      alert('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to invite user
      // await api.inviteTeamMember(organization.id, inviteEmail, inviteRole);
      alert(`Invitation sent to ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('reviewer');
    } catch (error) {
      alert('Failed to send invitation');
      console.error('Invite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this team member?')) {
      return;
    }

    try {
      // TODO: Call API to remove user
      // await api.removeTeamMember(organization.id, memberId);
      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
      alert('Team member removed');
    } catch (error) {
      alert('Failed to remove team member');
      console.error('Remove error:', error);
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'danger';
      case 'reviewer':
        return 'warning';
      case 'viewer':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="settings-team-container">
      <div className="team-header">
        <h2>Team Members</h2>
        <Button
          variant="primary"
          onClick={() => setShowInviteModal(true)}
        >
          + Invite Member
        </Button>
      </div>

      <Card title="Current Team">
        {teamMembers.length === 0 ? (
          <p>No team members yet</p>
        ) : (
          <div className="team-list">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="member-info">
                  <div className="member-avatar">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="member-details">
                    <h4 className="member-name">{member.name}</h4>
                    <p className="member-email">{member.email}</p>
                  </div>
                </div>

                <div className="member-meta">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role.toUpperCase()}
                  </Badge>
                  <span className="member-status">
                    {member.status === 'active' ? '✓ Active' : 'Pending'}
                  </span>
                </div>

                {member.role !== 'admin' && (
                  <button
                    className="member-remove-btn"
                    onClick={() => handleRemove(member.id)}
                    title="Remove member"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Roles & Permissions">
        <div className="roles-info">
          <div className="role-info">
            <h4>Admin</h4>
            <p>Full access to all settings and policies</p>
          </div>
          <div className="role-info">
            <h4>Reviewer</h4>
            <p>Can review and approve policies</p>
          </div>
          <div className="role-info">
            <h4>Viewer</h4>
            <p>Can view policies and assessments (read-only)</p>
          </div>
        </div>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteRole('reviewer');
        }}
        title="Invite Team Member"
        size="sm"
        footer={
          <div className="modal-footer-buttons">
            <Button
              variant="secondary"
              onClick={() => {
                setShowInviteModal(false);
                setInviteEmail('');
                setInviteRole('reviewer');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleInvite}
              loading={loading}
            >
              Send Invitation
            </Button>
          </div>
        }
      >
        <Input
          label="Email Address"
          type="email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="colleague@example.com"
          required
        />

        <div className="form-group">
          <label>Role</label>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="viewer">Viewer (Read-only)</option>
            <option value="reviewer">Reviewer (Can approve policies)</option>
            <option value="admin">Admin (Full access)</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
