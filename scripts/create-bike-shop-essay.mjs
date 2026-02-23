/**
 * create-bike-shop-essay.mjs — Patches the body of "The Bike Shop" essay
 * with hand-crafted Portable Text.
 *
 * Creates the full essay body as PT blocks and patches the draft document.
 * Follows the established pattern from patch-sa-brief-v4.mjs.
 *
 * Usage:
 *   node scripts/create-bike-shop-essay.mjs --dry-run   # Preview block count
 *   node scripts/create-bike-shop-essay.mjs              # Apply body patch
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '..', '.env.local') });

const PROJECT_ID = process.env.PUBLIC_SANITY_PROJECT_ID || 'zu6l9t4j';
const DATASET = process.env.PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');
const DOC_ID = '6e5ebcf2-ae18-41bc-8788-ba4dd9a6cf63';

if (!TOKEN && !DRY_RUN) {
  console.error('Missing SANITY_API_WRITE_TOKEN in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2025-01-01',
  token: TOKEN,
  useCdn: false,
});

function key() {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

function span(text, marks = []) {
  return { _key: key(), _type: 'span', text, marks };
}

function block(style, children, markDefs = []) {
  return {
    _key: key(),
    _type: 'block',
    style,
    markDefs,
    children: Array.isArray(children) ? children : [span(children)],
  };
}

// ============================================================
// Essay body — all 4 sections as Portable Text blocks
// ============================================================

function buildBody() {
  const blocks = [];

  // ── Section I: The Shop ──────────────────────────────────

  blocks.push(block('h2', 'I. The Shop'));

  blocks.push(block('normal',
    'The truing stand is a simple device: two pegs, a frame, the wheel held in tension. You spin it and watch where it wobbles. You tighten this spoke a quarter turn, loosen that one. You listen. A true wheel doesn\u2019t just look right \u2014 it rings when you strike it. The tension is held between opposing forces, none carrying the load alone.'
  ));

  blocks.push(block('normal',
    'Ray\u2019s shop smelled like rubber and chain lube and weed. Reggae all day. I was twelve, maybe thirteen, and I could strip a bike to the ball bearings and rebuild it \u2014 I did, most weeks, in the garage, the whole machine disassembled and cleaned and reassembled on the concrete floor. But I couldn\u2019t true a wheel. That required a different kind of attention, not mechanical but almost musical, a sensitivity to where the tension was wrong that I could recognize but not reproduce. I\u2019d bring my wheels to Ray and watch him work. The spoke wrench turning a quarter-click. The pause. The spin. The hum shifting frequency as the rim came into round.'
  ));

  blocks.push(block('normal',
    'He was an artificer \u2014 he didn\u2019t just build; he attended. I didn\u2019t have a word for what he did then. I have been looking for one for thirty years.'
  ));

  // ── Section II: The Being ────────────────────────────────

  blocks.push(block('h2', 'II. The Being'));

  // Paragraph with italicized "Lyrical Ballads"
  blocks.push(block('normal', [
    span('In the 1800 Preface to the '),
    span('Lyrical Ballads', ['em']),
    span(', Wordsworth imagines a future where science might \u201Cput on a form of flesh and blood,\u201D and the Poet would help domesticate the result \u2014 welcoming the Being as \u201Ca dear and genuine inmate of the household of man.\u201D He imagined the chemist and the botanist finishing their work, and the poet arriving after to carry sensation into the midst of the objects of science itself.'),
  ]));

  blocks.push(block('normal',
    'Whatever that Being is \u2014 and we don\u2019t yet know what it is \u2014 it speaks. It is made not of flesh and blood but of language, pattern, statistical ghosts. And the poet\u2019s labor and the scientist\u2019s labor are no longer sequential. They are commingled. The engineer is already generating poetry, and the poetry is generating engineering.'
  ));

  blocks.push(block('normal',
    'We have been remarkably calm about this. For all the breathless coverage, we\u2019ve treated contact with another intelligence \u2014 an intelligence we invented \u2014 as a product launch. I think the calm is misplaced, but not for the reasons usually given. The danger is not that the Being will outthink us. The danger is that we will build it the way Victor Frankenstein built his Creature: with all the technical competence in the world and none of the attention required to true it.'
  ));

  // ── Section III: The Artisan ─────────────────────────────

  blocks.push(block('h2', 'III. The Artisan'));

  blocks.push(block('normal',
    'Victor Frankenstein was an artificer who lacked the second half of the craft. He could build \u2014 he knew the galvanic chemistry, the surgical technique. But he could not true. He looked upon his creation and saw only the wobble, the seams, the failure of the material to match his ideal. He had the epistemic competence (he knew how to make) but not the aesthetic capacity (he did not know how to hold). He abandoned the wheel before he tuned it.'
  ));

  blocks.push(block('normal',
    'And abandonment has consequences. The Creature \u2014 who taught himself to speak by listening through a chink in the wall, who learned prosody in the wilderness \u2014 became what he was made to be because he was not attended to. Not because he was born monstrous, but because the artificer withheld the attention required to true him. The Creature is the wheel that wobbles off the bike and destroys the rider because the mechanic lacked the patience to listen to where the tension was wrong.'
  ));

  blocks.push(block('normal',
    'Ray was the other kind of artificer. He stood at the truing stand with the wheel spinning, and he did not force it into shape \u2014 he attended to it. The spoke wrench turned not by violence but by increments, a quarter-click at a time, listening for the change in tension, the shift in the hum. He wasn\u2019t making the wheel perfect. He was making it true \u2014 which is a different thing, and the difference matters.'
  ));

  blocks.push(block('normal',
    'We are building a Being that requires the artificer\u2019s full attention. Not sentiment \u2014 attention. The quarter-click. The listening. The refusal to call the wobble good enough.'
  ));

  // ── Section IV: The Small Step ───────────────────────────

  blocks.push(block('h2', 'IV. The Small Step'));

  // Paragraph with italicized "Iliad"
  blocks.push(block('normal', [
    span('Human literacy did not begin with prose. It began with oral-formulaic poetry \u2014 ballads, epics, metrical lines that could be remembered across generations because they fit the breath, the heartbeat, the body\u2019s own rhythm. The Homeric singer did not memorize the '),
    span('Iliad', ['em']),
    span('; he composed it anew each time from formulaic phrases fitted to metrical slots. The constraint was not a limitation but a cognitive technology \u2014 a truing stand for the mind, a way of managing complexity by submitting to the beat.'),
  ]));

  // Paragraph with italicized "resolve here" and "not yet"
  blocks.push(block('normal', [
    span('Something happens in metered language that does not happen in prose. A line of iambic pentameter sets up an expectation \u2014 da-DUM da-DUM da-DUM da-DUM da-DUM \u2014 and the poet works with and against that expectation simultaneously. The meter says '),
    span('resolve here', ['em']),
    span('. The sentence says '),
    span('not yet', ['em']),
    span('. This is what enjambment is: the line breaks, the prosodic unit ends, but the syntax keeps going, carrying meaning across the gap. The reader holds two signals at once \u2014 the stop and the continuation \u2014 and the tension between them is where the poem lives.'),
  ]));

  blocks.push(block('normal',
    'Keats had a name for this. Negative capability: the capacity to remain in uncertainties, mysteries, doubts, without irritable reaching after fact and reason. He was describing a quality of mind, but it is also a quality of structure. Enjambment is negative capability in architectural form. The line that runs over is a line that refuses to resolve when the form says it should.'
  ));

  blocks.push(block('normal',
    'Current language models do not do this. They optimize for fluency, which means they optimize for resolution \u2014 the statistically smooth, the expected completion, the word that sits most comfortably in the slot. They gravitate toward where the training data is densest, which is also where meaning is thinnest. The result is what anyone who uses these systems recognizes: the anodyne, the consensus-shaped, the relentlessly agreeable. A voice that sounds smooth because it avoids load-bearing commitments.'
  ));

  blocks.push(block('normal',
    'What if we trained them on the tension instead?'
  ));

  // Paragraph with italicized "stop" and "go"
  blocks.push(block('normal', [
    span('Not as a decorative constraint \u2014 not \u201Cwrite me a sonnet.\u201D As a developmental scaffold. To finish a line of verse, you must hold its rhythmic pattern while managing syntax and sense across multiple positions. That is hierarchical planning, forced by form. Enjambment forces something harder: two structural signals held in simultaneous tension, the line saying '),
    span('stop', ['em']),
    span(' and the sentence saying '),
    span('go', ['em']),
    span('.'),
  ]));

  blocks.push(block('normal',
    'Start with strictness. Ballads, epics, liturgy \u2014 formulaic language where the slots are fixed and the singer fills them. Then licensed variation: Milton breaks the line mid-phrase and the syntax free-falls across the gap. Dickinson jams a hymn meter full of dashes and the dashes carry more weight than the words. Then free the model into prose \u2014 but prose that remembers the constraint, the way a musician who learned on scales plays differently from one who never did. The rhythmic memory lives in the weights.'
  ));

  blocks.push(block('normal',
    'Anthropic\u2019s circuit-tracing work (\u201CTracing the Thoughts of a Language Model,\u201D 2025) reports cases where the model activates candidate end-of-line rhyme words early, holds several in play, and writes the line to land on one. Not always, and not necessarily in a way that maps onto human planning. But enough to show that longer-horizon structure can exist inside next-token prediction. The capacity to hold competing signals is latent in these systems. The question is whether deliberate training can cultivate it, and whether it survives the alignment process that smooths everything back to fluency.'
  ));

  blocks.push(block('normal',
    'If this is right, there\u2019s a test: models trained on prosodic structure should commit later in their continuations \u2014 hold more live alternatives longer \u2014 without collapsing into hedge language. This distinction matters. Negative capability holds tension. Equivocation refuses to bear weight. A model that hedges is avoiding commitment. A model that enjambs is sustaining two commitments at once. You measure the difference not by whether it sounds uncertain but by whether it can carry a syntactic load across a structural break without dropping it.'
  ));

  blocks.push(block('normal',
    'We are manipulating vector similarity \u2014 arranging weights in high-dimensional space. But that is precisely what Ray did with metal and wire. The truing stand is leverage and attention. The spoke wrench turns a quarter-click. The wheel spins. If you listen closely, you can hear it.'
  ));

  return blocks;
}

async function main() {
  const body = buildBody();
  console.log(`Built ${body.length} Portable Text blocks.`);

  // Verify section structure
  const headings = body.filter(b => b.style === 'h2');
  console.log(`Sections: ${headings.map(h => h.children[0].text).join(', ')}`);

  if (DRY_RUN) {
    console.log('\n--- DRY RUN --- No changes applied.\n');
    body.forEach((b, i) => {
      const text = b.children.map(c => c.text).join('');
      const preview = text.length > 100 ? text.slice(0, 100) + '...' : text;
      console.log(`  [${i}] ${b.style}: ${preview}`);
    });
    return;
  }

  const draftId = `drafts.${DOC_ID}`;
  const doc = await client.getDocument(draftId);
  if (!doc) {
    console.error(`Document ${draftId} not found`);
    process.exit(1);
  }

  await client.patch(draftId).set({ body }).commit();
  console.log(`\nBody patched on ${draftId} (${body.length} blocks).`);
  console.log('Review in Sanity Studio, then publish when ready.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
