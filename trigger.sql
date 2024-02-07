CREATE OR REPLACE FUNCTION update_tickets_audit() RETURNS TRIGGER AS $$
BEGIN
 
    INSERT INTO tickets_audit (ticket_id, summary, parent_ticket_id, description, status, assignee, last_updated_by, updated_at)
    VALUES (OLD.ticket_id, OLD.summary, OLD.parent_ticket_id, OLD.description, OLD.status, OLD.assignee, OLD.last_updated_by, now());
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_tickets_audit
BEFORE UPDATE
ON tickets FOR EACH ROW
EXECUTE PROCEDURE update_tickets_audit();

-- update tickets set status='In Progress' where ticket_id=2;