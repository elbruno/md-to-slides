---
contract: presentation-skill/v1
title: Building a Real-Time Event Pipeline
speaker: Sarah Chen
event: DevOps Summit 2024
date: October 15, 2024
duration: 25 minutes
audience: Software engineers and platform teams
tone: Technical and practical
theme: default-dark
objective: Show how to build a scalable event-driven architecture using Kafka and serverless functions
---

<!-- slide:type=title -->
# Building a Real-Time Event Pipeline

From monolith to event-driven architecture

- Sarah Chen
- Staff Engineer, Platform Team
- DevOps Summit 2024

??? notes
- Start with the problem: legacy batch jobs that take hours
- Promise: real-time processing in minutes, not hours
- Set expectations: this is hands-on with real code examples

---

# The Challenge

- Legacy batch jobs ran every 6 hours
- Customer data sync took 3-4 hours to complete
- Business couldn't react to real-time signals
- Database load caused production incidents

??? notes
- Paint the pain: missed opportunities due to stale data
- Connect with audience: ask who has similar batch job pain
- Frame this as a common architectural evolution story

---

# Event-Driven Architecture

- Producer services emit domain events
- Event bus decouples producers from consumers
- Multiple consumers process events independently
- Each service owns its domain and data

??? notes
- Keep this conceptual but clear
- Emphasize decoupling as the key benefit
- Mention scalability and fault isolation

---

<!-- slide:type=code -->
# Event Schema Design

```json
{
  "eventId": "evt_2024_10_15_1234",
  "eventType": "customer.profile.updated",
  "timestamp": "2024-10-15T10:30:45Z",
  "version": "1.0",
  "source": "customer-service",
  "data": {
    "customerId": "cust_9876",
    "fields": ["email", "preferences"],
    "previousVersion": 3,
    "currentVersion": 4
  }
}
```

??? notes
- Walk through the schema: id, type, timestamp are required
- Version field enables schema evolution
- Source field helps with debugging and routing
- Keep data minimal but sufficient

---

<!-- slide:type=code -->
# Producer Implementation

```python
from kafka import KafkaProducer
import json
from datetime import datetime

class EventPublisher:
    def __init__(self, bootstrap_servers):
        self.producer = KafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode()
        )
    
    def publish_event(self, topic, event_data):
        event = {
            "eventId": self.generate_id(),
            "eventType": event_data["type"],
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0",
            "source": "customer-service",
            "data": event_data["payload"]
        }
        self.producer.send(topic, value=event)
        self.producer.flush()
```

??? notes
- Show idiomatic Python with Kafka client
- Emphasize serialization strategy
- Point out flush for reliability guarantees
- Production code would add error handling and retries

---

<!-- slide:type=code -->
# Consumer Implementation

```python
from kafka import KafkaConsumer
import json

class EventConsumer:
    def __init__(self, topics, bootstrap_servers, group_id):
        self.consumer = KafkaConsumer(
            *topics,
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda m: json.loads(m.decode()),
            auto_offset_reset='earliest'
        )
    
    def process_events(self, handler):
        for message in self.consumer:
            event = message.value
            try:
                handler(event)
                self.consumer.commit()
            except Exception as e:
                print(f"Error processing {event['eventId']}: {e}")
```

??? notes
- Consumer groups enable horizontal scaling
- Auto-commit is disabled for at-least-once semantics
- Error handling is critical in production
- Idempotency in handlers prevents duplicate processing issues

---

# Infrastructure Requirements

- **Kafka Cluster:** 3-node minimum for production
- **Topic Configuration:** Replication factor 3, retention 7 days
- **Consumer Groups:** One per service or function
- **Monitoring:** Lag metrics, throughput, error rates

??? notes
- Don't skip infrastructure planning
- Kafka tuning is critical for performance
- Consumer lag is your most important metric
- Budget for ops overhead: Kafka isn't "serverless"

---

<!-- slide:type=code -->
# Serverless Consumer with AWS Lambda

```javascript
exports.handler = async (event) => {
  for (const record of event.records) {
    const message = JSON.parse(
      Buffer.from(record.value, 'base64').toString()
    );
    
    if (message.eventType === 'customer.profile.updated') {
      await updateSearchIndex(message.data);
      await invalidateCache(message.data.customerId);
    }
  }
  
  return { statusCode: 200 };
};
```

??? notes
- Lambda integrates with Kafka via Event Source Mapping
- Batch processing improves throughput
- Keep functions focused and fast
- Use Lambda for variable workloads

---

# Testing Strategy

- **Unit Tests:** Event schema validation and handler logic
- **Integration Tests:** Kafka test containers for local dev
- **Contract Tests:** Verify event compatibility across versions
- **Chaos Tests:** Partition failures, network delays

??? notes
- Testing events is different from testing REST APIs
- Test containers make local dev realistic
- Schema registry helps prevent breaking changes
- Chaos engineering catches resilience issues early

---

<!-- slide:type=code -->
# Monitoring and Observability

```python
from datadog import statsd

def handle_event(event):
    start = time.time()
    try:
        process_customer_update(event)
        statsd.increment('events.processed', 
                        tags=[f"type:{event['eventType']}"])
    except Exception as e:
        statsd.increment('events.failed',
                        tags=[f"type:{event['eventType']}"])
        raise
    finally:
        duration = time.time() - start
        statsd.histogram('event.processing_time', duration)
```

??? notes
- Metrics are essential for event-driven systems
- Tag by event type for granular visibility
- Track both throughput and latency
- Distributed tracing helps debug cross-service flows

---

# Results After Migration

- **Processing Time:** 3-4 hours → 2-3 minutes
- **Customer Data Freshness:** 6-hour lag → real-time
- **Database Load:** Reduced by 60% (no bulk batch queries)
- **Incident Rate:** Down 40% (better fault isolation)

??? notes
- Share real numbers to make the case compelling
- Emphasize business impact, not just tech metrics
- Acknowledge the operational complexity increase
- ROI depends on scale and use case

---

# Lessons Learned

- Start with one use case, prove the pattern works
- Schema evolution strategy is critical from day one
- Invest in observability before you have incidents
- Consumer lag alerts prevent most outages

??? notes
- Be honest about what worked and what didn't
- Schema versioning saved us multiple times
- Monitoring gaps caused our worst incidents
- Consumer lag is the most actionable metric

---

<!-- slide:type=demo-transition -->
# Live Demo

Let's watch events flow through the pipeline

??? notes
- Show producer sending events
- Watch consumer processing in real-time
- Demonstrate lag monitoring dashboard
- Keep it under 3 minutes

---

<!-- slide:type=closing -->
# Questions?

**Connect with me:**
- GitHub: @sarahchen
- Email: sarah.chen@example.com
- Slides: github.com/sarahchen/event-pipeline-talk

**Resources:**
- Sample code: github.com/sarahchen/kafka-patterns
- Architecture diagrams: Lucidchart link in slides

??? notes
- Leave time for Q&A
- Common questions: cost, Kafka vs alternatives, schema registry
- Offer to connect 1:1 for deeper dives
